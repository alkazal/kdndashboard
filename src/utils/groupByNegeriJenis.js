export const groupByNegeriJenis = (records) => {
  const negeriSet = new Set();
  const jenisSet = new Set();
  const map = {};

  records.forEach((r) => {
    const negeri = r.NEGERI;
    const jenis = r.JENIS;

    negeriSet.add(negeri);
    jenisSet.add(jenis);

    if (!map[jenis]) map[jenis] = {};
    map[jenis][negeri] = (map[jenis][negeri] || 0) + 1;
  });

  const negeriList = Array.from(negeriSet);
  const jenisList = Array.from(jenisSet);

  return { negeriList, jenisList, data: map };
};
