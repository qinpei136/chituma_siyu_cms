/**
 * 发布订阅模式(观察者模式)
 * handles: 事件处理函数集合
 * on: 订阅事件
 * emit: 发布事件
 * del: 删除事件
 **/

class PubSub {
	constructor() {
		this.handles = {};
	}

	// 订阅事件
	on(eventType, handle) {
		if (!this.handles.hasOwnProperty(eventType)) {
			this.handles[eventType] = [];
		}
		if (typeof handle == "function") {
			this.handles[eventType].push(handle);
		} else {
			throw new Error("缺少回调函数");
		}
		return this;
	}

	// 发布事件
	emit(eventType, ...args) {
		if (this.handles.hasOwnProperty(eventType)) {
			this.handles[eventType].forEach((item, key, arr) => {
				item.apply(null, args);
			});
		} else {
			throw new Error(`"${eventType}"事件未注册`);
		}
		return this;
	}

	// 删除事件
	del(eventType, handle) {
		if (!this.handles.hasOwnProperty(eventType)) {
			throw new Error(`"${eventType}"事件未注册`);
		} else if (typeof handle != "function") {
			throw new Error("缺少回调函数");
		} else {
			this.handles[eventType].forEach((item, key, arr) => {
				if (item == handle) {
					arr.splice(key, 1);
				}
			});
		}
		return this; // 实现链式操作
	}
}

// 下面做一些骚操作
let callback = function () {
	console.log("you are so nice");
};

let pubsub = new PubSub();
pubsub
	.on("sethadle", (set) => {
		console.log(set);
	})
	.on("tow", (tow) => {
		console.log(tow);
	});
pubsub.emit("sethadle", "dfasf");
pubsub.del("sethadle", () => {});
pubsub.del("sethafffdle", () => {});
pubsub.emit("tow", "sssss");
