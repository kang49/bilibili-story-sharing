import time

# Set the countdown duration in seconds
countdown_duration = 30

# Perform the countdown
for remaining_time in range(countdown_duration, 0, -1):
    print(f"Countdown: {remaining_time} seconds")
    time.sleep(1)

print("Countdown complete!")
