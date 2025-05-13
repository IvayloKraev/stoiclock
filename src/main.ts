import Alpine from "alpinejs";

window.Alpine = Alpine;

interface Clock {
	name: string;
	dateTime: Date;
}

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
		const clocks: Clock[] = JSON.parse(
			localStorage.getItem("clocks") || "[]",
		);
		clocks.push({ name: this.name, dateTime });
		localStorage.setItem("clocks", JSON.stringify(clocks));

		this.clear();
	},
	clear() {
		this.name = null;
		this.date = null;
		this.time = null;
	},
}));

Alpine.start();
