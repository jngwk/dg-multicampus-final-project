import React from "react";
import Hero from "../components/main/Hero";
import CustomParticles from "../components/shared/CustomParticles";
import Section from "../components/main/Section";

export default function Main() {
  return (
    <>
      <CustomParticles />
      <div className="snap-y snap-mandatory h-screen">
        <Hero /> <Section />
      </div>
    </>
  );
}
