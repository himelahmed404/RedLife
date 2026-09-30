// Bangladesh districts and upazilas (https://github.com/nuhil/bangladesh-geocode)
import rawDistricts from "@/lib/asset/data/districts.json";
import rawUpazilas from "@/lib/asset/data/upazilas.json";

const byName = (a, b) => a.name.localeCompare(b.name);

export const districts = [...rawDistricts[2].data].sort(byName);
const allUpazilas = rawUpazilas[2].data;

export const upazilasOf = (districtId) =>
  districtId ? allUpazilas.filter((u) => u.district_id === districtId).sort(byName) : [];

// Users and requests store names, the selects work with ids
export const districtById = (id) => districts.find((d) => d.id === id);
export const districtByName = (name) => districts.find((d) => d.name === name);
export const upazilaById = (id) => allUpazilas.find((u) => u.id === id);
