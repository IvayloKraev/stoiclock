import Alpine from "alpinejs";

window.Alpine = Alpine;

interface Timer {
	id: number;
	name: string;
	endTime: number;
	leftHours: number;
	leftMinutes: number;
	leftSeconds: number;
}
type NewClock = Omit<Timer, "id" | "leftHours" | "leftMinutes" | "leftSeconds">;
type Clock = Omit<Timer, "leftHours" | "leftMinutes" | "leftSeconds">;

interface ClockStore {
	clocks: Clock[];
	init(): void;
	getAll(): void;
	add(newClock: NewClock): void;
	update(newClock: Clock): void;
	remove(id: number): void;
}

Alpine.store("clocks", {
	clocks: [] as Clock[],
	init() {
		(this as ClockStore).clocks = JSON.parse(
			localStorage.getItem("clocks") || "[]",
		);
	},
	getAll() {
		(this as ClockStore).clocks = JSON.parse(
			localStorage.getItem("clocks") || "[]",
		);
		return (this as ClockStore).clocks;
	},
	add(newClock: NewClock) {
		(this as ClockStore).clocks = JSON.parse(
			localStorage.getItem("clocks") || "[]",
		);
		(this as ClockStore).clocks.push({
			id: Date.now(),
			name: newClock.name,
			endTime: newClock.endTime,
		});
		localStorage.setItem(
			"clocks",
			JSON.stringify((this as ClockStore).clocks),
		);
	},
	update(clock: Clock) {
		(this as ClockStore).clocks = JSON.parse(
			localStorage.getItem("clocks") || "[]",
		);
		(this as ClockStore).clocks.forEach((c, index) => {
			if (c.id === clock.id) {
				(this as ClockStore).clocks[index] = clock;
			}
		});
		localStorage.setItem(
			"clocks",
			JSON.stringify((this as ClockStore).clocks),
		);
	},
	remove(id: number) {
		(this as ClockStore).clocks = JSON.parse(
			localStorage.getItem("clocks") || "[]",
		);
		(this as ClockStore).clocks = (this as ClockStore).clocks.filter((clock) => clock.id !== id);
		localStorage.setItem(
			"clocks",
			JSON.stringify((this as ClockStore).clocks),
		);
	},
} as ClockStore);

Alpine.data("newClockForm", () => ({
	name: null as string | null,
	date: null as string | null,
	time: null as string | null,
	submit() {
		//TODO: Add validation

		if (!this.name || !this.date || !this.time) {
			this.clear();
			return;
		}

		const dateTime = new Date(this.date + " " + this.time).getTime();

		(Alpine.store("clocks") as ClockStore).add({
			name: this.name,
			endTime: dateTime,
		});

		this.clear();
	},
	clear() {
		this.name = null;
		this.date = null;
		this.time = null;
	},
}));

Alpine.data("timer", () => ({
	timers: [] as Timer[],
	selectedTimer: null as Timer | null,
	init() {
		const clocks: Clock[] = JSON.parse(
			JSON.stringify((Alpine.store("clocks") as ClockStore).clocks),
		);

		clocks.forEach((clock) => {
			const leftEpochTime = clock.endTime - Date.now();
			const [hours, minutes, seconds] = this.getLeftTime(leftEpochTime);

			this.timers.push({
				id: clock.id,
				name: clock.name,
				endTime: clock.endTime,
				leftHours: hours,
				leftMinutes: minutes,
				leftSeconds: seconds,
			});
		});

		this.selectedTimer = this.timers[0];

		setInterval(() => {
			this.timers.forEach((timer) => {
				const leftEpochTime = timer.endTime - Date.now();
				const [hours, minutes, seconds] = this.getLeftTime(leftEpochTime);
				timer.leftHours = hours;
				timer.leftMinutes = minutes;
				timer.leftSeconds = seconds;
			});
		}, 100);
	},
	getLeftTime(leftTime: number) {
		leftTime = Math.floor(leftTime / 1_000);

		const hours   = Math.floor((leftTime % 86_400) / 3_600);
		const minutes = Math.floor((leftTime % 3_600) / 60);
		const seconds = leftTime % 60;

		return [hours, minutes, seconds];
	},
}));

Alpine.start();
