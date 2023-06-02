import { set, get, clear } from "idb-keyval";

const bigData = new ArrayBuffer(50 * 1024 * 1024);
const bigData1P5 = new ArrayBuffer(10 * 1024 * 1024);
const size = (bigData.byteLength / 1024 / 1024).toFixed(2);

const MAX = 50;
const record = {
  averageSet: 0,
  averageGet: 0,
  averageMultiGet: 0,
  averageMultiSet: 0,
};
async function lineSet(count: number, time: number) {
  if (count >= MAX) {
    record.averageSet = time / MAX;
    lineRead(0, 0);
    return;
  }

  await clear();
  let start = performance.now();
  await set("bigData", bigData);
  let end = performance.now();
  time += end - start;
  lineSet(count + 1, time);
}

async function lineRead(count: number, time: number) {
  if (count >= MAX) {
    record.averageGet = time / MAX;
    lineMultiSet(0, 0);
    return;
  }

  let start = performance.now();
  await get("bigData");
  let end = performance.now();
  time += end - start;
  lineRead(count + 1, time);
}

async function lineMultiSet(count: number, time: number) {
  if (count >= MAX) {
    record.averageMultiSet = time / MAX;
    lineMultiRead(0, 0);
    return;
  }

  await clear();
  console.log("---anshi---1", 1);
  let start = performance.now();
  await Promise.all([
    set("bigData-1", bigData1P5),
    set("bigData-2", bigData1P5),
    set("bigData-3", bigData1P5),
    set("bigData-4", bigData1P5),
    set("bigData-5", bigData1P5),
  ]);
  let end = performance.now();
  time += end - start;
  lineMultiSet(count + 1, time);
}

async function lineMultiRead(count: number, time: number) {
  if (count >= MAX) {
    record.averageMultiGet = time / MAX;
    finish();
    return;
  }

  let start = performance.now();
  await Promise.all([
    get("bigData-1"),
    get("bigData-2"),
    get("bigData-3"),
    get("bigData-4"),
    get("bigData-5"),
  ]);
  let end = performance.now();
  time += end - start;
  lineMultiRead(count + 1, time);
}

function finish() {
  (document.querySelector("#tip") as HTMLDivElement).textContent = "完成";
  alert(`
  ${record.averageGet.toFixed(2)} - 读取${MAX}次${size}mb的数据,平均耗时${record.averageGet.toFixed(2)};
  ${record.averageMultiGet.toFixed(2)} - 均分5个 Key 读取${MAX}次总量为${size}mb的数据,平均耗时${record.averageMultiGet.toFixed(2)};
  ${record.averageSet.toFixed(2)} - 写入${MAX}次${size}mb的数据,平均耗时${record.averageSet.toFixed(2)};
  ${record.averageMultiSet.toFixed(2)} - 均分5个 Key 写入${MAX}次总量${size}mb的数据,平均耗时${record.averageMultiSet.toFixed(2)};
    `);
  clear();
}

function toSave() {
  lineSet(0, 0);
  (document.querySelector("#tip") as HTMLDivElement).textContent =
    "进行中,请等待...";
}

document.querySelector("#button")?.addEventListener("click", toSave);
