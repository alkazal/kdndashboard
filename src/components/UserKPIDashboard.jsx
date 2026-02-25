import { useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const normalizeText = (value) =>
  (value || "")
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatValue = (value) => (value === undefined || value === null || value === "" ? "-" : value);

export default function UserKPIDashboard({ user, laporan, onClose, positionClass }) {
  const operasiRows = useMemo(() => {
    if (!user || !Array.isArray(laporan)) return [];
    return laporan.filter(
      (row) => normalizeText(row["KETUA OPERASI"]) === normalizeText(user.name)
    );
  }, [user, laporan]);

  const kpi = useMemo(() => {
    const totalOperasi = operasiRows.length;
    const negeriSet = new Set(operasiRows.map((row) => row.NEGERI).filter(Boolean));
    const jenisSet = new Set(operasiRows.map((row) => row.JENIS).filter(Boolean));
    const statusCounts = operasiRows.reduce(
      (acc, row) => {
        const status = row["STATUS KES"] || "TIADA";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      totalOperasi,
      negeri: negeriSet.size,
      jenis: jenisSet.size,
      statusCounts
    };
  }, [operasiRows]);

  if (!user) return null;

  return (
    <div className={`fixed z-50 ${positionClass || "top-4 left-92.5"}`}>
      <div className="bg-white w-[70vw] max-w-5xl rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">KPI DASHBOARD PENGGUNA</h2>
            <p className="text-xs text-slate-500">PROFIL PEGAWAI & RINGKASAN OPERASI</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
            aria-label="Tutup"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.photo_url}
                alt={user.name}
                className="w-32 h-32 rounded-full border object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-300">{user.name}</h3>
                <p className="text-sm text-slate-400">{formatValue(user.no_kp)}</p>
                <p className="text-sm text-slate-400">{formatValue(user.rank)}</p>
                <p className="text-sm text-slate-400">{formatValue(user.grade)}</p>
                <p className="text-sm text-slate-400">{formatValue(user.address)}</p>
                {/* <p className="text-xs text-slate-400">{formatValue(user.email)}</p> */}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <Info label="Status" value={user.status} />
              <Info label="Telefon" value={user.phone} />
              <Info label="Negeri" value={user.state} />
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Jumlah Operasi" value={kpi.totalOperasi} />
            <KpiCard label="Negeri Terlibat" value={kpi.negeri} />
            <KpiCard label="Jenis Akta" value={kpi.jenis} />
            <KpiCard
              label="Status Kes (Selesai)"
              value={kpi.statusCounts["SELESAI"] || 0}
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-400">Senarai Operasi Terlibat</h4>
              <span className="text-xs text-slate-200">{operasiRows.length} rekod</span>
            </div>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Tarikh</th>
                    <th className="px-3 py-2">Jenis</th>
                    <th className="px-3 py-2">Kategori</th>
                    <th className="px-3 py-2">Negeri</th>
                    <th className="px-3 py-2">Lokasi</th>
                    <th className="px-3 py-2">Status Kes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {operasiRows.map((row, index) => (
                    <tr key={`${row.ID || index}`} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-200">{formatValue(row.TARIKH)}</td>
                      <td className="px-3 py-2 text-slate-200">{formatValue(row.JENIS)}</td>
                      <td className="px-3 py-2 text-slate-200">{formatValue(row.KATEGORI)}</td>
                      <td className="px-3 py-2 text-slate-200">{formatValue(row.NEGERI)}</td>
                      <td className="px-3 py-2 text-slate-200">{formatValue(row.LOKASI)}</td>
                      <td className="px-3 py-2 text-slate-200">{formatValue(row["STATUS KES"])}</td>
                    </tr>
                  ))}
                  {operasiRows.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-slate-400" colSpan={6}>
                        Tiada rekod operasi ditemui untuk pegawai ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm text-slate-700 font-medium">{formatValue(value)}</div>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-gray-800 border  text-zinc-700 rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-wide text-zinc-700">{label}</div>
      <div className="text-3xl font-semibold text-zinc-700mt-1 text-right">{value}</div>
    </div>
  );
}
