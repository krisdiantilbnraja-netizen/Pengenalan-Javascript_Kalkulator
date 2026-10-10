// State kalkulator
let tampil = "0";        // angka yang sedang tampil
let angkaPertama = null; // operand pertama
let operator = null;     // operator aktif
let mulaiBaru = false;   // true = input berikutnya mengganti layar
let memori = 0;

const layar = document.getElementById("layar");
const labelMemori = document.getElementById("memori");

function render() {
  let teks = tampil;
  if (teks.length > 12) {
    teks = String(Number(teks).toPrecision(10)).slice(0, 12);
  }
  layar.textContent = teks.replace(".", ",");
  layar.style.fontSize = teks.length > 9 ? "30px" : "";
  labelMemori.classList.toggle("aktif", memori !== 0);
}

function hitung(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
  }
  return b;
}

function bersihkanHasil(n) {
  if (!isFinite(n)) return "Error";
  return String(parseFloat(n.toPrecision(12)));
}

function inputAngka(a) {
  if (tampil === "Error") tampil = "0";
  if (mulaiBaru) { tampil = "0"; mulaiBaru = false; }
  if (tampil.replace(/[-.]/g, "").length >= 12) return;
  tampil = tampil === "0" ? a : tampil + a;
  if (a === "00" && tampil === "00") tampil = "0";
}

function inputOperator(op) {
  if (tampil === "Error") return;
  if (operator && !mulaiBaru) {
    tampil = bersihkanHasil(hitung(angkaPertama, parseFloat(tampil), operator));
  }
  angkaPertama = parseFloat(tampil);
  operator = op;
  mulaiBaru = true;
}

function samaDengan() {
  if (operator === null || tampil === "Error") return;
  tampil = bersihkanHasil(hitung(angkaPertama, parseFloat(tampil), operator));
  operator = null;
  angkaPertama = null;
  mulaiBaru = true;
}

function aksi(nama) {
  const nilai = parseFloat(tampil);
  switch (nama) {
    case "ac": tampil = "0"; angkaPertama = null; operator = null; mulaiBaru = false; break;
    case "ce": tampil = "0"; mulaiBaru = false; break;
    case "hapus":
      if (mulaiBaru || tampil === "Error") break;
      tampil = tampil.length > 1 ? tampil.slice(0, -1) : "0";
      if (tampil === "-") tampil = "0";
      break;
    case "titik":
      if (mulaiBaru) { tampil = "0"; mulaiBaru = false; }
      if (!tampil.includes(".")) tampil += ".";
      break;
    case "akar":
      tampil = nilai < 0 ? "Error" : bersihkanHasil(Math.sqrt(nilai));
      mulaiBaru = true;
      break;
    case "persen":
      tampil = bersihkanHasil(nilai / 100);
      mulaiBaru = true;
      break;
    case "m+": memori += nilai; mulaiBaru = true; break;
    case "m-": memori -= nilai; mulaiBaru = true; break;
    case "mrc":
      // tekan sekali = panggil memori, tekan lagi (saat sudah tampil) = hapus memori
      if (tampil === bersihkanHasil(memori) && mulaiBaru) { memori = 0; }
      else { tampil = bersihkanHasil(memori); mulaiBaru = true; }
      break;
    case "samadengan": samaDengan(); break;
  }
}

document.querySelector(".tombol-grid").addEventListener("click", (e) => {
  const tombol = e.target.closest("button");
  if (!tombol) return;
  if (tombol.dataset.angka) inputAngka(tombol.dataset.angka);
  else if (tombol.dataset.op) inputOperator(tombol.dataset.op);
  else if (tombol.dataset.aksi) aksi(tombol.dataset.aksi);
  render();
});

// Dukungan keyboard
document.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) inputAngka(e.key);
  else if ("+-*/".includes(e.key)) inputOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); samaDengan(); }
  else if (e.key === "." || e.key === ",") aksi("titik");
  else if (e.key === "Backspace") aksi("hapus");
  else if (e.key === "Escape") aksi("ac");
  else if (e.key === "%") aksi("persen");
  else return;
  render();
});

render();