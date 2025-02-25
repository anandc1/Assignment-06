// Enhanced Workout Tracking Logic
class WorkoutTracker {
    constructor() {
        // Initialize workout arrays and DOM elements
        this.workouts = [];
        this.workoutForm = document.getElementById('workout-form');
        this.workoutList = document.getElementById('workout-list');
        this.totalWorkoutsElem = document.getElementById('total-workouts');
        this.totalDurationElem = document.getElementById('total-duration');

        // Add event listeners
        this.workoutForm.addEventListener('submit', this.logWorkout.bind(this));

        // Exercise type suggestions
        this.exerciseTypes = [
            'Running', 'Weight Lifting', 'Cycling', 'Swimming', 
            'Yoga', 'HIIT', 'Pilates', 'Boxing'
        ];
        this.setupExerciseTypeAutocomplete();
    }

    setupExerciseTypeAutocomplete() {
        const exerciseTypeSelect = document.getElementById('exercise-type');
        
        // Clear existing options
        exerciseTypeSelect.innerHTML = '<option value="">Select Exercise Type</option>';
        
        // Add new options
        this.exerciseTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.toLowerCase();
            option.textContent = type;
            exerciseTypeSelect.appendChild(option);
        });
    }

    logWorkout(event) {
        event.preventDefault();

        // Get form values
        const exerciseType = document.getElementById('exercise-type').value;
        const duration = document.getElementById('duration').value;
        const intensity = document.getElementById('intensity').value;

        // Validate inputs
        if (!exerciseType || !duration || !intensity) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Create workout object
        const workout = {
            id: Date.now(),
            type: exerciseType,
            duration: parseInt(duration),
            intensity: parseInt(intensity),
            date: new Date().toLocaleString()
        };

        // Add workout to array
        this.workouts.push(workout);

        // Render workout in list
        this.renderWorkout(workout);

        // Update stats
        this.updateStats();

        // Show success notification
        this.showNotification(`${workout.type} workout logged successfully!`, 'success');

        // Reset form
        this.workoutForm.reset();
    }

    renderWorkout(workout) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${this.capitalizeFirstLetter(workout.type)}</strong> - 
                ${workout.duration} mins (Intensity: ${workout.intensity}) 
                <small>on ${workout.date}</small>
            </div>
            <button onclick="workoutTracker.deleteWorkout(${workout.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        this.workoutList.appendChild(li);
    }

    deleteWorkout(id) {
        // Remove workout from array
        this.workouts = this.workouts.filter(workout => workout.id !== id);

        // Re-render workout list and update stats
        this.rebuildWorkoutList();
        this.updateStats();

        // Show delete notification
        this.showNotification('Workout deleted successfully.', 'info');
    }

    rebuildWorkoutList() {
        // Clear existing list
        this.workoutList.innerHTML = '';

        // Re-render all workouts
        this.workouts.forEach(workout => this.renderWorkout(workout));
    }

    updateStats() {
        // Calculate total workouts
        this.totalWorkoutsElem.textContent = this.workouts.length;

        // Calculate total duration
        const totalDuration = this.workouts.reduce((total, workout) => 
            total + workout.duration, 0);
        this.totalDurationElem.textContent = `${totalDuration} mins`;

        // Persist workouts
        this.saveWorkouts();
    }

    saveWorkouts() {
        localStorage.setItem('fitflowWorkouts', JSON.stringify(this.workouts));
    }

    loadWorkouts() {
        const savedWorkouts = localStorage.getItem('fitflowWorkouts');
        if (savedWorkouts) {
            this.workouts = JSON.parse(savedWorkouts);
            this.rebuildWorkoutList();
            this.updateStats();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to body
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Initialize workout tracker when page loads
const workoutTracker = new WorkoutTracker();

// Load saved workouts
window.addEventListener('DOMContentLoaded', () => {
    workoutTracker.loadWorkouts();
});

// Add some global styles for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }

    .notification.success {
        background-color: #2ecc71;
    }

    .notification.error {
        background-color: #e74c3c;
    }

    .notification.info {
        background-color: #3498db;
    }

    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateX(100%);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);