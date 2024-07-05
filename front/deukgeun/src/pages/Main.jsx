import React from "react";
import Hero from "../components/main/Hero";
import CustomParticles from "../components/shared/CustomParticles";
import Section from "../components/main/Section";

// https://github.com/tsparticles/react
export default function Main() {
  return (
    <>
      <CustomParticles />
      <div className="z-0">
        <Hero /> <Section />
      </div>
    </>
  );
}
