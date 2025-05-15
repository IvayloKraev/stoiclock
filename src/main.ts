import Alpine from "alpinejs";

window.Alpine = Alpine;

interface Timer {
	id: number;
	name: string;
	dateTime: Date;
	leftTime: Date;
}
type NewClock = Omit<Timer, "id" | "leftTime">;
type Clock = Omit<Timer, "leftTime">;

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
			dateTime: newClock.dateTime,
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

		const dateTime: Date = new Date(this.date + " " + this.time);

		(Alpine.store("clocks") as ClockStore).add({
			name: this.name,
			dateTime: dateTime,
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
	formattedLeftTime: "HH:MM:SS",
	init() {
		const clocks: Clock[] = JSON.parse(
			JSON.stringify((Alpine.store("clocks") as ClockStore).clocks),
		);

		clocks.forEach((clock) => {
			const dateTime: Date = new Date(clock.dateTime);

			this.timers.push({
				id: clock.id,
				name: clock.name,
				dateTime,
				leftTime: new Date(dateTime.getTime() - Date.now()),
			});
		});

		setInterval(() => {
			this.timers.forEach((timer) => {
				timer.leftTime = new Date(
					timer.dateTime.getTime() - Date.now(),
				);
				this.updateTime(timer.leftTime);
			});
		}, 1000);
	},
	updateTime(leftTime: Date) {
		const hours: number = leftTime.getHours();
		const minutes: number = leftTime.getMinutes();
		const seconds: number = leftTime.getSeconds();

		this.formattedLeftTime = `${hours}:${minutes}:${seconds}`;
	},
}));

Alpine.start();
