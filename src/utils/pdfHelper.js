// Okutan Akademi - Öğretmen Ders Programı Doğrudan PDF İndirme Yardımcısı
import html2pdf from "html2pdf.js";

export const exportTeacherScheduleToPDF = (teacher, students, lessonHours, daysOfWeek) => {
  if (!teacher) {
    alert("Lütfen geçerli bir öğretmen seçiniz.");
    return;
  }

  const teacherStudents = students.filter(s => s.teacherId === teacher.id);

  // Öğrenci Liste Satırları
  const studentRowsHtml = teacherStudents.map((student, idx) => {
    const lessonsText = student.lessons && student.lessons.length > 0
      ? student.lessons.map(l => `${l.day.substring(0, 3)} (${l.time.split(" ")[0]})`).join(", ")
      : "Henüz atanmadı";

    return `
      <tr>
        <td style="text-align: center; font-weight: bold; width: 30px; border: 1px solid #dcdde1; padding: 6px;">${idx + 1}</td>
        <td style="font-weight: bold; color: #2d3436; border: 1px solid #dcdde1; padding: 6px;">${student.studentName || ""}</td>
        <td style="text-align: center; border: 1px solid #dcdde1; padding: 6px;">${student.studentAgeGrade || ""}</td>
        <td style="border: 1px solid #dcdde1; padding: 6px;">${student.name || ""}</td>
        <td style="text-align: center; font-family: monospace; font-weight: bold; border: 1px solid #dcdde1; padding: 6px;">${student.phone || ""}</td>
        <td style="color: #6c5ce7; font-weight: 600; border: 1px solid #dcdde1; padding: 6px;">${lessonsText}</td>
      </tr>
    `;
  }).join("");

  // Ders Programı Matrisi Satırları (Gün x Saat)
  const gridRowsHtml = lessonHours.map(hour => {
    const cellsHtml = daysOfWeek.map(day => {
      const studentInSlot = teacherStudents.find(s =>
        s.lessons && s.lessons.some(l => l.day === day && l.time === hour)
      );

      if (studentInSlot) {
        return `
          <td style="background-color: ${teacher.id === "teacher-zehra" ? "#e6f7f4" : "#f0edff"}; border: 1px solid #dcdde1; border-left: 3px solid ${teacher.id === "teacher-zehra" ? "#00b894" : "#6c5ce7"}; padding: 5px; text-align: center; vertical-align: middle;">
            <div style="font-weight: bold; color: ${teacher.id === "teacher-zehra" ? "#00b894" : "#6c5ce7"}; font-size: 8.5pt;">${studentInSlot.studentName}</div>
            <div style="font-size: 7.5pt; color: #2d3436;">${studentInSlot.studentAgeGrade}</div>
            <div style="font-size: 7pt; color: #636e72;">📞 ${studentInSlot.phone}</div>
          </td>
        `;
      }
      return `<td style="color: #b2bec3; background-color: #fafafa; border: 1px solid #dcdde1; padding: 5px; text-align: center;">—</td>`;
    }).join("");

    return `
      <tr>
        <th style="background-color: #f1f2f6; color: #2d3436; width: 90px; font-size: 8pt; border: 1px solid #dcdde1; padding: 5px; text-align: center;">${hour}</th>
        ${cellsHtml}
      </tr>
    `;
  }).join("");

  const themeColor = teacher.id === "teacher-zehra" ? "#00b894" : "#6c5ce7";
  const teacherIcon = teacher.id === "teacher-zehra" ? "👩‍🏫" : "👨‍🏫";

  // PDF İçin Geçici HTML Elemanı Oluştur
  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.background = "#ffffff";
  container.style.color = "#2d3436";
  container.style.fontFamily = "'Segoe UI', Arial, sans-serif";

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${themeColor}; padding-bottom: 10px; margin-bottom: 15px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div>
          <h1 style="margin: 0; font-size: 18pt; color: ${themeColor}; letter-spacing: 0.5px;">OKUTAN AKADEMİ</h1>
          <p style="margin: 2px 0 0 0; font-size: 9.5pt; color: #636e72; font-weight: 600;">Hızlı Okuma ve Gelişim Merkezi — Öğretmen Ders Programı</p>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 13pt; font-weight: bold; color: #2d3436;">${teacherIcon} ${teacher.name}</div>
        <div style="font-size: 8.5pt; color: #7f8c8d; margin-top: 3px;">Tarih: ${new Date().toLocaleDateString('tr-TR')} | Toplam Öğrenci: ${teacherStudents.length}</div>
      </div>
    </div>

    <div style="font-size: 10.5pt; font-weight: bold; color: ${themeColor}; margin-bottom: 6px; text-transform: uppercase;">📅 Haftalık Ders Programı Çizelgesi</div>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 8.5pt;">
      <thead>
        <tr>
          <th style="background-color: ${themeColor}; color: #ffffff; padding: 6px; font-size: 9pt; width: 90px; border: 1px solid #dcdde1;">Saat / Gün</th>
          ${daysOfWeek.map(d => `<th style="background-color: ${themeColor}; color: #ffffff; padding: 6px; font-size: 9pt; border: 1px solid #dcdde1;">${d}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${gridRowsHtml}
      </tbody>
    </table>

    <div style="font-size: 10.5pt; font-weight: bold; color: ${themeColor}; margin-bottom: 6px; text-transform: uppercase; margin-top: 15px;">👨‍🎓 Atanan Öğrenci ve Veli İletişim Rehberi</div>
    <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
      <thead>
        <tr>
          <th style="background-color: #2d3436; color: #ffffff; padding: 6px; text-align: center; width: 30px; border: 1px solid #2d3436;">#</th>
          <th style="background-color: #2d3436; color: #ffffff; padding: 6px; text-align: left; border: 1px solid #2d3436;">Öğrenci Adı Soyadı</th>
          <th style="background-color: #2d3436; color: #ffffff; padding: 6px; text-align: center; border: 1px solid #2d3436;">Sınıf / Yaş</th>
          <th style="background-color: #2d3436; color: #ffffff; padding: 6px; text-align: left; border: 1px solid #2d3436;">Veli Adı Soyadı</th>
          <th style="background-color: #2d3436; color: #ffffff; padding: 6px; text-align: center; border: 1px solid #2d3436;">Veli Telefon</th>
          <th style="background-color: #2d3436; color: #ffffff; padding: 6px; text-align: left; border: 1px solid #2d3436;">Ders Seansları</th>
        </tr>
      </thead>
      <tbody>
        ${studentRowsHtml.length > 0 ? studentRowsHtml : `<tr><td colspan="6" style="text-align:center; padding: 10px; color: #7f8c8d; border: 1px solid #dcdde1;">Bu öğretmene atanmış kesin kayıtlı öğrenci bulunmamaktadır.</td></tr>`}
      </tbody>
    </table>

    <div style="margin-top: 15px; padding-top: 6px; border-top: 1px solid #e1e8ed; display: flex; justify-content: space-between; font-size: 7.5pt; color: #95a5a6;">
      <span>Okutan Akademi Öğrenci & Takip Otomasyonu</span>
      <span>Suda Dynamics Projesidir</span>
    </div>
  `;

  document.body.appendChild(container);

  const teacherSlug = teacher.name.toLowerCase().replace(/\s+/g, "_");
  const today = new Date().toISOString().split("T")[0];
  const filename = `okutan_ogretmen_programi_${teacherSlug}_${today}.pdf`;

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
  };

  // Doğrudan PDF dosyasını indir
  html2pdf().set(opt).from(container).save().then(() => {
    document.body.removeChild(container);
  }).catch(() => {
    document.body.removeChild(container);
  });
};
