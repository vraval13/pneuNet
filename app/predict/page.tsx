"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import jsPDF from "jspdf";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

// Define the form schema using Zod
const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0).max(150),
  doctorName: z.string().min(2, "Doctor name must be at least 2 characters"),
  birthDate: z.date(),
  gender: z.string(),
  consent: z.boolean().refine((val) => val, "You must agree to the terms"),
});

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consent: false,
    },
  });

  // Function to get detailed explanation from Gemini
  const getGeminiExplanation = async (
    diagnosis: string,
    imageBase64?: string
  ) => {
    try {
      // Use the newer Gemini 1.5 Flash model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
  You are a highly experienced medical expert specializing in radiology and pulmonary diseases. Based on the given diagnosis ${diagnosis}, provide a professional and comprehensive medical analysis in a structured format. The explanation should be informative, precise, and easy to understand for both medical professionals and patients.

  Ensure your response includes the following key sections:

  - **Clinical Interpretation**: Provide a detailed yet concise medical explanation of the diagnosis. Describe how the condition appears in radiological imaging (e.g., X-ray findings). Mention any key indicators or abnormalities observed.

  - **Possible Causes**: Outline the most common underlying causes or risk factors. Include relevant medical conditions or lifestyle factors that contribute to the diagnosis.

  - **Recommended Actions**: Specify the next steps for the patient based on the severity of the condition. Mention whether further diagnostic tests, specialist consultations, or immediate medical attention is required.

  - **Treatment Options**: Summarize the available medical interventions, including medications, therapies, or surgical options (if applicable). Differentiate between mild, moderate, and severe cases in terms of treatment approaches.

  - **Prognosis**: Provide an outlook on the expected recovery timeline and possible complications. Highlight factors that can influence the prognosis, such as early detection and timely intervention.

  - **Preventive Measures**: Suggest lifestyle modifications, medical follow-ups, or vaccinations (if relevant) to prevent the condition from worsening or recurring.

  Use clear and precise medical terminology while ensuring the explanation is accessible to patients. Keep the response concise yet informative, ideally under 1000 words.
`;
      // For text-only input (since gemini-1.5-flash doesn't support image input directly like the vision model)
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error getting Gemini explanation:", error);
      return (
        `Standard information about ${diagnosis}:\n\n` +
        `Pneumonia is an infection that inflames the air sacs in one or both lungs. ` +
        `The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing. ` +
        `Treatment depends on the cause and severity but typically includes antibiotics, rest, and fluids.`
      );
    }
  };

  // Function to convert image to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve(reader.result?.toString().split(",")[1] || "");
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to generate the PDF report
  const generatePDFReport = async (
    values: z.infer<typeof formSchema>,
    diagnosis: string
  ) => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Add logo or header
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128); // Navy blue
    doc.text("Pneumonia Detection Report", 105, yPosition, { align: "center" });
    yPosition += 15;

    // Add horizontal line
    doc.setDrawColor(0, 0, 128);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Add patient details section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Patient Information", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Full Name: ${values.fullName}`, 20, yPosition);
    doc.text(`Age: ${values.age}`, 110, yPosition);
    yPosition += 8;

    doc.text(`Doctor's Name: ${values.doctorName}`, 20, yPosition);
    doc.text(`Birth Date: ${format(values.birthDate, "PPP")}`, 110, yPosition);
    yPosition += 8;

    doc.text(`Gender: ${values.gender}`, 20, yPosition);
    yPosition += 15;

    // Add image if available
    if (imagePreview) {
      try {
        const imgData = imagePreview;
        doc.addImage(imgData, "JPEG", 20, yPosition, 80, 60);
        doc.text("X-ray Image:", 20, yPosition - 5);
        yPosition += 70;
      } catch (error) {
        console.error("Error adding image to PDF:", error);
      }
    }

    // Add diagnosis section
    doc.setFontSize(14);
    doc.text("Diagnosis Summary", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const diagnosisText = `The model has detected: ${diagnosis}`;
    doc.text(diagnosisText, 20, yPosition);
    yPosition += 10;

    // Get detailed explanation from Gemini
    const detailedExplanation = await getGeminiExplanation(diagnosis);

    // Add detailed explanation section
    doc.setFontSize(14);
    doc.text("Detailed Medical Analysis", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(detailedExplanation, 170);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 5 + 15;

    // Add recommendations section
    doc.setFontSize(14);
    doc.text("Medical Recommendations", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const recommendations =
      diagnosis === "Pneumonia Detected"
        ? [
            "1. Immediate consultation with a pulmonologist or infectious disease specialist",
            "2. Complete prescribed antibiotic course if bacterial pneumonia is suspected",
            "3. Chest physiotherapy if recommended by your physician",
            "4. Adequate hydration and nutritional support",
            "5. Oxygen therapy if oxygen saturation is below 92%",
            "6. Follow-up chest imaging in 4-6 weeks to monitor resolution",
            "7. Vaccination against influenza and pneumococcal pneumonia after recovery",
          ]
        : [
            "1. Follow-up with your primary care physician if symptoms persist",
            "2. Maintain regular health check-ups",
            "3. Practice good respiratory hygiene",
            "4. Consider vaccination if at risk for respiratory infections",
            "5. Monitor for any new or worsening symptoms",
          ];

    recommendations.forEach((item) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(item, 25, yPosition);
      yPosition += 8;
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    // doc.text('This report is generated by AI and should be reviewed by a qualified healthcare professional.',
    //   105, 287, { align: 'center' });
    doc.text(`Report generated on: ${format(new Date(), "PPPpp")}`, 105, 293, {
      align: "center",
    });

    // Save the PDF
    doc.save(`${values.fullName.replace(" ", "_")}_Pneumonia_Report.pdf`);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      alert("Please upload an X-ray image.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Call the backend API
      const response = await axios.post(
        "https://3a43-34-169-118-246.ngrok-free.app/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Display the result
      const diagnosis = response.data.prediction;
      setResult(diagnosis);

      // Generate the PDF report
      await generatePDFReport(values, diagnosis);
    } catch (error: any) {
      console.error("Error during prediction:", error);
      alert(
        error.response?.data?.error || "An error occurred while predicting."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
        <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Patient Information
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age Field */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Doctor's Name Field */}
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date Field */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload Field */}
              <div className="space-y-4">
                <FormLabel>Upload X-ray Image</FormLabel>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="x-ray-upload"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="x-ray-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to upload X-ray image"}
                    </span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="X-ray preview"
                      className="max-h-64 rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>

              {/* Consent Checkbox */}
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions and consent to the
                        analysis of my medical data
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Generate Report"}
              </Button>
            </form>
          </Form>

          {/* Prediction Result */}
          {result && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold">Prediction Result</h2>
              <p className="text-lg mt-4">{result}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
