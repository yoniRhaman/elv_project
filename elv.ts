class Elevator {
    private currentFloor: number;
    private destinationFloors: Set<number>;
    private direction: 'up' | 'down' | 'idle';
    private id: number;
    private onFloorArrivalCallback: (floor: number) => void;
    private arrivalTime: number;
    private animationInterval: number;

    constructor(id: number, onFloorArrivalCallback: (floor: number) => void) {
        this.currentFloor = 1;
        this.destinationFloors = new Set();
        this.direction = 'idle';
        this.id = id;
        this.onFloorArrivalCallback = onFloorArrivalCallback;
        this.arrivalTime = 0;
        this.animationInterval = 500; // Animation interval (in milliseconds)
    }

    public getCurrentFloor(): number {
        return this.currentFloor;
    }

    public requestFloor(floor: number): void {
        this.destinationFloors.add(floor);
        this.moveElevator();
    }

    private moveElevator(): void {
        if (this.direction === 'idle') {
            const nextFloor = this.getNextFloor();
            if (nextFloor !== undefined) {
                this.direction = nextFloor > this.currentFloor ? 'up' : 'down';
            }
        }

        const nextFloor = this.getNextFloor();
        if (nextFloor !== undefined) {
            this.animateMovement(nextFloor);
        }
    }

    private animateMovement(nextFloor: number): void {
        const distance = Math.abs(nextFloor - this.currentFloor);
        const totalSteps = distance * 2; // Each floor takes half a second, so 2 steps per floor

        let step = 0;
        this.animationInterval = setInterval(() => {
            if (step === totalSteps) {
                clearInterval(this.animationInterval);
                this.currentFloor = nextFloor;
                this.direction = 'idle';
                this.onFloorArrivalCallback(nextFloor);
                setTimeout(() => this.moveElevator(), 2000); // Delay for 2 seconds at destination floor
            } else {
                step++;
                if (this.direction === 'up') {
                    this.currentFloor++;
                } else if (this.direction === 'down') {
                    this.currentFloor--;
                }
            }
        }, this.animationInterval);
    }

    private getNextFloor(): number | undefined {
        if (this.destinationFloors.size === 0) return undefined;
        let nextFloor: number | undefined;
        if (this.direction === 'up') {
            nextFloor = Math.min(...Array.from(this.destinationFloors).filter(floor => floor > this.currentFloor));
        } else if (this.direction === 'down') {
            nextFloor = Math.max(...Array.from(this.destinationFloors).filter(floor => floor < this.currentFloor));
        }
        return nextFloor;
    }
}

class ElevatorController {
    private elevators: Elevator[];
    private floorRequestTimers: Map<number, number>;

    constructor(numElevators: number, numFloors: number) {
        this.elevators = [];
        for (let i = 1; i <= numElevators; i++) {
            this.elevators.push(new Elevator(i, this.onElevatorArrival.bind(this)));
        }
        this.floorRequestTimers = new Map();
        this.setupElevatorControls(numFloors);
    }

    private setupElevatorControls(numFloors: number): void {
        const building = document.getElementById('building');
        if (building) {
            for (let floor = 1; floor <= numFloors; floor++) {
                const floorDiv = document.createElement('div');
                floorDiv.className = 'floor';
                floorDiv.style.height = '110px'; // Height of each floor
                floorDiv.style.backgroundImage = 'url(brick-background.jpg)'; // Background image URL
                building.appendChild(floorDiv);

                const blackBar = document.createElement('div');
                blackBar.className = 'black-bar';
                blackBar.style.height = '7px'; // Height of black bar between floors
                floorDiv.appendChild(blackBar);

                const callButton = document.createElement('button');
                callButton.className = 'metal linear elevator-call';
                callButton.textContent = `${floor}`;
                callButton.dataset.floor = `${floor}`;
                callButton.addEventListener('click', () => this.requestElevator(floor));
                floorDiv.appendChild(callButton);
            }
        }
    }

    public requestElevator(floor: number): void {
        this.floorRequestTimers.set(floor, 60); // Set initial countdown timer to 60 seconds
        this.updateElevatorControls();
        const closestElevator = this.findClosestElevator(floor);
        closestElevator.requestFloor(floor);
    }

    private onElevatorArrival(floor: number): void {
        this.floorRequestTimers.delete(floor);
        this.updateElevatorControls();
    }

    private findClosestElevator(floor: number): Elevator {
        let closestElevator = this.elevators[0];
        let minDistance = Math.abs(floor - closestElevator.getCurrentFloor());
        for (let i = 1; i < this.elevators.length; i++) {
            const distance = Math.abs(floor - this.elevators[i].getCurrentFloor());
            if (distance < minDistance) {
                closestElevator = this.elevators[i];
                minDistance = distance;
            }
        }
        return closestElevator;
    }

    private updateElevatorControls(): void {
        for (const [floor, timer] of this.floorRequestTimers.entries()) {
            const button = document.querySelector(`button[data-floor="${floor}"]`);
            if (button) {
                button.textContent = `${floor} (${timer}s)`;
            }
        }
        this.floorRequestTimers.forEach((timer, floor) => {
            if (timer > 0) {
                this.floorRequestTimers.set(floor, timer - 1);
            }
        });
        setTimeout(() => this.updateElevatorControls(), 1000); // Update controls every second
    }
}

// Example usage
const controller = new ElevatorController(3, 10); // 3 elevators and 10 floors
