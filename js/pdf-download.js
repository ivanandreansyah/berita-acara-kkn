/* ================================================================
   PDF DOWNLOAD - KKN Desa Papasan
   Menggunakan html2canvas + jsPDF untuk download berita acara
   ================================================================ */

function downloadBeritaAcaraPDF() {
    const btn = document.getElementById('btnDownloadPDF');
    const article = document.getElementById('article-content');

    if (!article) {
        alert('Konten artikel tidak ditemukan.');
        return;
    }

    // Jika berjalan pada protokol file:// (akses lokal tanpa server web)
    if (window.location.protocol === 'file:') {
        alert('Karena Anda mengakses file secara lokal (tanpa web server), browser akan menggunakan cetak sistem untuk mengunduh PDF secara aman.\n\nPada dialog yang muncul, silakan pilih opsi "Simpan sebagai PDF" / "Save as PDF" sebagai Printernya.');
        window.print();
        return;
    }

    // Loading state
    btn.disabled = true;
    btn.innerHTML = '<span class="pdf-spinner"></span> Menyiapkan PDF...';

    // Untuk halaman dengan tabs (edukasi daur ulang), pastikan semua tab visible dulu
    // kita capture hanya tab yang aktif
    const activeTab = document.querySelector('.ba-tab-content.active');

    // Tentukan element yang akan di-capture
    const captureTarget = article;

    // Sembunyikan elemen yang tidak perlu di PDF
    const hideInPDF = document.querySelectorAll('.pdf-hide');
    hideInPDF.forEach(el => el.style.visibility = 'hidden');

    // Fungsi untuk convert image ke base64 agar tidak taint canvas
    const images = captureTarget.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
            if (img.src.startsWith('data:')) {
                resolve();
                return;
            }
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const clone = new Image();
            clone.onload = () => {
                canvas.width = clone.width;
                canvas.height = clone.height;
                ctx.drawImage(clone, 0, 0);
                try {
                    img.src = canvas.toDataURL('image/jpeg');
                } catch(e) {
                    // Jika gagal (karena cross-origin), biarkan saja
                }
                resolve();
            };
            clone.onerror = () => resolve();
            clone.src = img.src;
        });
    });

    Promise.all(imagePromises).then(() => {
        // Opsi html2canvas
        const options = {
            scale: 2,
            useCORS: false,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: captureTarget.scrollWidth,
            onclone: function(clonedDoc) {
                // Di dokumen clone, pastikan semua tab content terlihat untuk capture bertahap
                const clonedArticle = clonedDoc.getElementById('article-content');
                if (clonedArticle) {
                    clonedArticle.style.maxWidth = '900px';
                    clonedArticle.style.padding = '20px';
                }
            }
        };

        html2canvas(captureTarget, options).then(function(canvas) {
        // Kembalikan visibility
        hideInPDF.forEach(el => el.style.visibility = '');

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // Setup jsPDF - A4
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
        const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
        const margin = 10; // mm
        const contentWidth = pageWidth - (margin * 2);

        // Hitung tinggi proporsional
        const canvasAspect = canvas.height / canvas.width;
        const imgWidth = contentWidth;
        const imgHeight = imgWidth * canvasAspect;

        // Tambah header KKN
        pdf.setFillColor(27, 94, 32);
        pdf.rect(0, 0, pageWidth, 12, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KKN DESA PAPASAN  |  Kec. Bangsri, Kab. Jepara, Jawa Tengah', margin, 8);

        // Posisi mulai konten (setelah header)
        const startY = 15;
        const availableHeight = pageHeight - startY - 10; // kurangi footer

        // Jika konten muat dalam 1 halaman
        if (imgHeight <= availableHeight) {
            pdf.addImage(imgData, 'JPEG', margin, startY, imgWidth, imgHeight);
        } else {
            // Multi-halaman: potong canvas menjadi beberapa bagian
            const totalPages = Math.ceil(imgHeight / availableHeight);

            for (let page = 0; page < totalPages; page++) {
                if (page > 0) {
                    pdf.addPage();
                    // Header di setiap halaman
                    pdf.setFillColor(27, 94, 32);
                    pdf.rect(0, 0, pageWidth, 12, 'F');
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('KKN DESA PAPASAN  |  Kec. Bangsri, Kab. Jepara, Jawa Tengah', margin, 8);
                }

                // Posisi gambar: geser ke atas sesuai halaman
                const yOffset = startY - (page * availableHeight);
                pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight);

                // Clip region (jsPDF tidak mendukung clip langsung, pakai rect putih untuk menutupi)
                // Tutup area di luar halaman dengan persegi putih
                if (page < totalPages - 1) {
                    pdf.setFillColor(255, 255, 255);
                    const coveredBottom = startY + availableHeight;
                    const remainingHeight = pageHeight - coveredBottom;
                    if (remainingHeight > 0) {
                        pdf.rect(0, coveredBottom, pageWidth, remainingHeight, 'F');
                    }
                }

                // Footer halaman
                pdf.setFillColor(240, 247, 240);
                pdf.rect(0, pageHeight - 8, pageWidth, 8, 'F');
                pdf.setTextColor(100, 100, 100);
                pdf.setFontSize(7);
                pdf.setFont('helvetica', 'normal');
                pdf.text(
                    'Halaman ' + (page + 1) + ' dari ' + totalPages + '  |  kkn.papasan@email.com',
                    pageWidth / 2,
                    pageHeight - 3,
                    { align: 'center' }
                );
            }
        }

        // Tambah footer di halaman terakhir (jika 1 halaman)
        if (imgHeight <= availableHeight) {
            pdf.setFillColor(240, 247, 240);
            pdf.rect(0, pageHeight - 8, pageWidth, 8, 'F');
            pdf.setTextColor(100, 100, 100);
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.text(
                'KKN UNISNU Jepara  |  Desa Papasan, Bangsri  |  kkn.papasan@email.com',
                pageWidth / 2,
                pageHeight - 3,
                { align: 'center' }
            );
        }

        // Generate nama file dari judul halaman
        const pageTitle = document.title
            .replace(' - Desa Papasan', '')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50);

        pdf.save('berita-acara-' + pageTitle + '.pdf');

        // Reset tombol
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Download PDF';

    }).catch(function(err) {
        console.error('PDF Error:', err);
        hideInPDF.forEach(el => el.style.visibility = '');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-pdf me-2"></i>Download PDF';
        alert('Gagal membuat PDF. Detail Error: ' + err.message);
    });
    });
}
