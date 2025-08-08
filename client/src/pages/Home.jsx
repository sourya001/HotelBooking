import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import NewsLetter from "../components/NewsLetter";
import RecommendedHotel from "../components/RecommendedHotel";
import PageTransition from "../components/PageTransition";

const Home = () => {
  return (
    <PageTransition>
      <Hero />
      <RecommendedHotel />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </PageTransition>
  );
};

export default Home;
