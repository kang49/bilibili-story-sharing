function countdown(durationInSeconds) {
    let remainingTime = durationInSeconds;
  
    const countdownInterval = setInterval(() => {
      console.clear(); // Clears the console to update the countdown
      console.log(`Countdown: ${remainingTime} seconds`);
      remainingTime--;
  
      if (remainingTime < 0) {
        clearInterval(countdownInterval);
        console.log("Countdown complete!");
      }
    }, 1000); // Update the countdown every 1000 milliseconds (1 second)
  }
  
  // Start a countdown for 30 seconds
  countdown(30);
  