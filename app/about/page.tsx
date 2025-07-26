'use client';

import { Microscope, Shield, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            About PneumoDetect
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            PneumoDetect is an AI-powered platform designed to assist healthcare professionals in detecting pneumonia through advanced chest X-ray analysis. Our mission is to provide accurate, secure, and instant results to improve patient outcomes.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background/50 backdrop-blur rounded-lg">
              <Microscope className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Innovation</h3>
              <p className="text-muted-foreground">
                Leveraging cutting-edge AI technology to revolutionize pneumonia detection.
              </p>
            </div>
            <div className="p-6 bg-background/50 backdrop-blur rounded-lg">
              <Shield className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Security</h3>
              <p className="text-muted-foreground">
                Ensuring the privacy and safety of your medical data with enterprise-grade security.
              </p>
            </div>
            <div className="p-6 bg-background/50 backdrop-blur rounded-lg">
              <Clock className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Efficiency</h3>
              <p className="text-muted-foreground">
                Delivering fast and reliable results to support timely medical decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Mission</h2>
          <p className="text-lg text-muted-foreground text-center">
            At PneumoDetect, we aim to bridge the gap between technology and healthcare by providing accessible and reliable AI solutions. Our goal is to empower medical professionals with tools that enhance diagnostic accuracy and improve patient care.
          </p>
        </div>
      </section>
    </div>
  );
}