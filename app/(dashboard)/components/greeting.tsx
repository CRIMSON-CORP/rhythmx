"use client";

function getGreeting() {
  const hours = new Date().getHours();
  let greeting = "";
  if (hours < 12) {
    greeting = "Morning";
  } else if (hours < 18) {
    greeting = "Afternoon";
  } else {
    greeting = "Evening";
  }
  return greeting;
}

function Greeting() {
  return (
    <h1 className="font-heading text-3xl md:text-[32px] leading-tight font-semibold">
      Good {getGreeting()}, Captain 👨🏾‍🚀
    </h1>
  );
}

export default Greeting;
