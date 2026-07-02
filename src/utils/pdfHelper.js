// Okutan Akademi - Öğretmen Ders Programı PDF / Baskı Dışa Aktarıcısı

export const exportTeacherScheduleToPDF = (teacher, students, lessonHours, daysOfWeek) => {
  if (!teacher) {
    alert("Lütfen geçerli bir öğretmen seçiniz.");
    return;
  }

  // Bu öğretmene ait öğrencileri bul
  const teacherStudents = students.filter(s => s.teacherId === teacher.id);

  // Öğrenci Liste Satırları
  const studentRowsHtml = teacherStudents.map((student, idx) => {
    const lessonsText = student.lessons && student.lessons.length > 0
      ? student.lessons.map(l => `${l.day.substring(0, 3)} (${l.time.split(" ")[0]})`).join(", ")
      : "Henüz atanmadı";

    return `
      <tr>
        <td style="text-align: center; font-weight: bold; width: 30px;">${idx + 1}</td>
        <td style="font-weight: bold; color: #2d3436;">${student.studentName || ""}</td>
        <td style="text-align: center;">${student.studentAgeGrade || ""}</td>
        <td>${student.name || ""}</td>
        <td style="text-align: center; font-family: monospace; font-weight: bold;">${student.phone || ""}</td>
        <td style="color: #6c5ce7; font-weight: 600;">${lessonsText}</td>
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
          <td class="slot-filled">
            <div class="student-title">${studentInSlot.studentName}</div>
            <div class="student-grade">${studentInSlot.studentAgeGrade}</div>
            <div class="student-parent">📞 ${studentInSlot.phone}</div>
          </td>
        `;
      }
      return `<td class="slot-empty">—</td>`;
    }).join("");

    return `
      <tr>
        <th class="hour-cell">${hour}</th>
        ${cellsHtml}
      </tr>
    `;
  }).join("");

  const themeColor = teacher.id === "teacher-zehra" ? "#00b894" : "#6c5ce7";
  const teacherIcon = teacher.id === "teacher-zehra" ? "👩‍🏫" : "👨‍🏫";

  // PDF / Printable HTML Şablonu
  const printHtml = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Haftalık Ders Programı - ${teacher.name}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 10mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #2d3436;
          margin: 0;
          padding: 15px;
          background: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid ${themeColor};
          padding-bottom: 12px;
          margin-bottom: 15px;
        }
        .brand-logo-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        .brand-info h1 {
          margin: 0;
          font-size: 20pt;
          color: ${themeColor};
          letter-spacing: 0.5px;
        }
        .brand-info p {
          margin: 2px 0 0 0;
          font-size: 10pt;
          color: #636e72;
          font-weight: 600;
        }
        .teacher-meta {
          text-align: right;
        }
        .teacher-meta .teacher-name {
          font-size: 14pt;
          font-weight: bold;
          color: #2d3436;
        }
        .teacher-meta .report-date {
          font-size: 9pt;
          color: #7f8c8d;
          margin-top: 4px;
        }

        /* Program Matrisi Tablosu */
        .schedule-title {
          font-size: 11pt;
          font-weight: bold;
          color: ${themeColor};
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        table.grid-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 9pt;
        }
        table.grid-table th, table.grid-table td {
          border: 1px solid #dcdde1;
          padding: 6px 4px;
          text-align: center;
        }
        table.grid-table th {
          background-color: ${themeColor};
          color: #ffffff;
          font-weight: bold;
          font-size: 9.5pt;
        }
        table.grid-table th.hour-cell {
          background-color: #f1f2f6;
          color: #2d3436;
          width: 100px;
          font-size: 8.5pt;
        }
        td.slot-filled {
          background-color: ${teacher.id === "teacher-zehra" ? "#e6f7f4" : "#f0edff"};
          border-left: 3px solid ${themeColor};
          vertical-align: middle;
        }
        td.slot-empty {
          color: #b2bec3;
          background-color: #fafafa;
        }
        .student-title {
          font-weight: bold;
          color: ${themeColor};
          font-size: 9pt;
        }
        .student-grade {
          font-size: 7.5pt;
          color: #2d3436;
        }
        .student-parent {
          font-size: 7pt;
          color: #636e72;
          margin-top: 2px;
        }

        /* Öğrenci Listesi Tablosu */
        table.roster-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9pt;
        }
        table.roster-table th {
          background-color: #2d3436;
          color: #ffffff;
          padding: 6px 8px;
          font-weight: bold;
          text-align: left;
        }
        table.roster-table td {
          border: 1px solid #dcdde1;
          padding: 6px 8px;
        }
        table.roster-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        /* Footer */
        .footer {
          margin-top: 15px;
          padding-top: 8px;
          border-top: 1px solid #e1e8ed;
          display: flex;
          justify-content: space-between;
          font-size: 8pt;
          color: #95a5a6;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="brand-logo-title">
          <img src="/logo.png" class="brand-logo" alt="Okutan Akademi" onerror="this.style.display='none'" />
          <div class="brand-info">
            <h1>OKUTAN AKADEMİ</h1>
            <p>Hızlı Okuma ve Gelişim Merkezi — Öğretmen Ders Programı</p>
          </div>
        </div>
        <div class="teacher-meta">
          <div class="teacher-name">${teacherIcon} ${teacher.name}</div>
          <div class="report-date">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')} | Toplam Öğrenci: ${teacherStudents.length}</div>
        </div>
      </div>

      <div class="schedule-title">📅 Haftalık Ders Programı Çizelgesi</div>
      <table class="grid-table">
        <thead>
          <tr>
            <th style="width: 100px;">Saat / Gün</th>
            ${daysOfWeek.map(d => `<th>${d}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${gridRowsHtml}
        </tbody>
      </table>

      <div class="schedule-title" style="margin-top: 15px;">👨‍🎓 Atanan Öğrenci ve Veli İletişim Listesi</div>
      <table class="roster-table">
        <thead>
          <tr>
            <th style="text-align: center; width: 30px;">#</th>
            <th>Öğrenci Adı Soyadı</th>
            <th style="text-align: center;">Sınıf / Yaş</th>
            <th>Veli Adı Soyadı</th>
            <th style="text-align: center;">Veli Telefon</th>
            <th>Ders Seansları</th>
          </tr>
        </thead>
        <tbody>
          ${studentRowsHtml.length > 0 ? studentRowsHtml : `<tr><td colspan="6" style="text-align:center; padding: 12px; color: #7f8c8d;">Bu öğretmene atanmış kesin kayıtlı öğrenci bulunmamaktadır.</td></tr>`}
        </tbody>
      </table>

      <div class="footer">
        <span>Okutan Akademi Öğrenci & Takip Otomasyonu</span>
        <span>Suda Dynamics Projesidir</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  // Yeni pencere açarak yazdır/PDF yap
  const printWindow = window.open("", "_blank", "width=1100,height=850");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  } else {
    alert("Açılır pencere engellendi. Lütfen tarayıcınızda açılır pencerelere izin veriniz.");
  }
};
