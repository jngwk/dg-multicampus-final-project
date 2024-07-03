import React from "react";
import Hero from "../components/main/Hero";
import CustomParticles from "../components/shared/CustomParticles";
import Section from "../components/main/Section";

// https://github.com/tsparticles/react
export default function Main() {
  console.log("메인화면");
  return (
    <>
      <CustomParticles />
      <div className="snap-y snap-mandatory h-screen z-0">
        <Hero /> <Section />
      </div>
    </>
  );
}
