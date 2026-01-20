import { XMarkIcon, PrinterIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function LaporanDetail({ record, onClose }) {
  const containerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
    //   x: 500,
    //   opacity: 0,
      duration: 0.6,
      ease: "power2."
    });
  }, []);

  if (!record) return null;

  const images = record.GAMBAR
    ? record.GAMBAR.split(",").map((img) => img.trim())
    : [];

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="w-full h-full object-contain"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2"
            >
              <XMarkIcon className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="bg-slate-300 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg" style={{ opacity: '100' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <div className="text-2xl text-slate-500 font-bold">
              {record.JENIS}
            </div>
            <h2 className="text-xl font-bold text-black">
              LAPORAN PENGUATKUASAAN DETAIL
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-black"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 text-sm">
          {/* Ringkasan */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-yellow-400">
            <Info label="Tarikh" value={record.TARIKH} />
            <Info label="Negeri" value={record.NEGERI} />
            <Info label="Status Kes" value={record["STATUS KES"]} />
          </section>

          {/* Lokasi */}
          <section className="text-yellow-400">
            <SectionTitle title="Maklumat Operasi" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Lokasi" value={record.LOKASI} />
              <Info label="Kategori" value={record.KATEGORI} />
              <Info label="Ketua Operasi" value={record["KETUA OPERASI"]} />
            </div>
          </section>

          {/* Aktiviti */}
          <section className="text-yellow-600">
            <SectionTitle title="Aktiviti Penguatkuasaan" />
            <Info
              label="Aktiviti"
              value={record.AKTIVITI}
              block
            />
            <Info
              label="Butiran Aktiviti"
              value={record["BUTIRAN AKTIVITI"]}
              block
            />
            <Info
              label="Hasil Aktiviti"
              value={record["HASIL AKTIVITI"]}
              block
            />
          </section>

          {/* Bukti / Media */}
          {images.length > 0 && (
            <section>
              <SectionTitle title="Bukti / Media" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => {
                  // Convert .png to .jpeg and fix typo "imge3" to "image3"
                  let imageName = img.replace('.png', '.jpeg').replace('imge3', 'image3');
                  return (
                    <div key={i} className="bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                      <img
                        src={`/img/${imageName}`}
                        alt={`Bukti ${i + 1}`}
                        className="w-full h-32 object-cover hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(`/img/${imageName}`)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden h-32 items-center justify-center text-slate-400 text-sm">
                        {img}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tindakan */}
          <section className="text-yellow-600">
            <SectionTitle title="Tindakan & Status" />
            <Info
              label="Tindakan"
              value={record.TINDAKAN}
              block
            />
            <Info
              label="Status Kes"
              value={record["STATUS KES"]}
              block
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-slate-300">
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-white border">
            <PrinterIcon className="w-4 h-4" /> Cetak
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-primary">
            <DocumentArrowDownIcon className="w-4 h-4" /> Muat Turun PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function SectionTitle({ title }) {
  return (
    <h3 className="font-semibold mb-3 text-slate-700">
      {title}
    </h3>
  );
}

function Info({ label, value, block }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">
        {label}
      </div>
      <div
        className={`${
          block ? "bg-slate-50 p-3 rounded" : ""
        }`}
      >
        {value || "-"}
      </div>
    </div>
  );
}
