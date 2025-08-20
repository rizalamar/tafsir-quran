const surahList = document.querySelector(".surah-list");
const detailSurah = document.querySelector(".detail-surah");
const searchInput = document.getElementById("search");
let allSurah = [];

function renderDetailSurah(
	number,
	name_id,
	name_en,
	translation_en,
	translation_id,
	number_of_verses,
	revelation,
	revelation_en,
	tafsir
) {
	return `
  <div id="content">
   <h3>${number}. ${name_id} (${name_en})</h3>
     <p>${translation_id} (${translation_en})</p>
     <p>Verses: ${number_of_verses}</p>
     <p>Revelation: ${revelation_en} (${revelation})</p>
     <p>${tafsir}</p>
    </div>
  `;
}

function renderSurah(list) {
	const surahItem = list
		.map((surah) => {
			return `
      <div class="surah-item" data-id="${surah.number}">
        <div class="left">
          <h3 class="surah-text-title-surah">${surah.name_id}</h3>
          <p class="surah-text-translation">${surah.translation_id}</p>
        </div>
        <div class="right">
          <p class="surah-text-arab">${surah.name_short}</p>
          <p class="surah-verses">${surah.number_of_verses}</p>
        </div>
      </div>
      `;
		})
		.join("");

	surahList.innerHTML = surahItem || "<p>Surah tidak ditemukan.</p>";
}

async function loadQuran() {
	try {
		const res = await fetch(`https://api.myquran.com/v2/quran/surat/semua`);
		if (!res.ok) throw new Error("Failed to fetch quran");
		const { data } = await res.json();
		allSurah = data;
		console.table(allSurah);

		renderSurah(allSurah);

		document.querySelectorAll(".surah-item").forEach((item) =>
			item.addEventListener("click", () => {
				detailSurah.style.display = "block";
				const id = item.dataset.id;
				loadDetailSurah(id);
			})
		);
	} catch (err) {
		surahList.innerHTML = `<p>Error: ${err.message}</p>`;
	}
}

async function loadDetailSurah(id) {
	try {
		const res = await fetch(`https://api.myquran.com/v2/quran/surat/${id}`);
		if (!res.ok) throw new Error("Failed to fetch detail of surah.");
		const { data } = await res.json();
		console.log(data);

		detailSurah.innerHTML = renderDetailSurah(
			data.number,
			data.name_id,
			data.name_en,
			data.translation_en,
			data.translation_id,
			data.number_of_verses,
			data.revelation,
			data.revelation_en,
			data.tafsir
		);
	} catch (err) {
		detailSurah.innerHTML = `<p>Error: ${err.message}</p>`;
	}
}

searchInput.addEventListener("input", (e) => {
	const keyword = e.target.value.toLowerCase();
	const filtered = allSurah.filter((surah) =>
		surah.name_id.toLowerCase().includes(keyword)
	);
	renderSurah(filtered);
});

detailSurah.addEventListener("click", () => {
	detailSurah.style.display = "none";
});

loadQuran();
