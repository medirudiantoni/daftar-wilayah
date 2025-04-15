import axios from "axios";
import { AlignJustify } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Provinsi {
  id: string;
  name: string;
}

interface Kabupaten {
  id: string;
  name: string;
  province_id: string;
}

interface Kecamatan {
  id: string;
  name: string;
  regency_id: string;
}

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [menu, setMenu] = useState(false);
  const [prov, setProv] = useState<Provinsi[]>([]);
  const [kab, setKab] = useState<Kabupaten[]>([]);
  const [kec, setKec] = useState<Kecamatan[]>([]);
  const [showProv, setShowProv] = useState<Provinsi[]>([]);

  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingKab, setLoadingKab] = useState(false);
  const [loadingKec, setLoadingKec] = useState(false);

  const [selectedProvId, setSelectedProvId] = useState<string | null>(null);
  const [selectedKabId, setSelectedKabId] = useState<string | null>(null);
  const [selectedKecId, setSelectedKecId] = useState<string | null>(null);

  const handleChange = (value: string) => {
    const number = parseInt(value);
    if (!isNaN(number) && number > 0 && number <= 32) {
      setCount(number);
    } else {
      setCount(0);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMenu(true)
    fetchProvinces();
  };

  const handleSetKab = async (provId: string) => {
    setSelectedProvId(provId);
    setSelectedKabId(null);
    setSelectedKecId(null);
    setKec([]);
    await fetchKabupaten(provId);
  };

  const handleSetKec = async (kabId: string) => {
    setSelectedKabId(kabId);
    setSelectedKecId(null);
    await fetchKecamatan(kabId);
  };

  const handleSelectKecamatan = (kecId: string) => {
    setSelectedKecId(kecId);
  };

  useEffect(() => {
    if (prov.length > 0 && count > 0) {
      setShowProv(prov.slice(0, count));
    }
  }, [count, prov]);

  const fetchProvinces = async () => {
    setLoadingProv(true);
    try {
      const res = await axios.get<Provinsi[]>(
        'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json'
      );
      setProv(res.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoadingProv(false);
    }
  };

  const fetchKabupaten = async (provId: string) => {
    setLoadingKab(true);
    try {
      const res = await axios.get<Kabupaten[]>(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`
      );
      setKab(res.data);
    } catch (error) {
      console.error("Error fetching kabupaten:", error);
    } finally {
      setLoadingKab(false);
    }
  };

  const fetchKecamatan = async (kabId: string) => {
    setLoadingKec(true);
    try {
      const res = await axios.get<Kecamatan[]>(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`
      );
      setKec(res.data);
    } catch (error) {
      console.error("Error fetching kecamatan:", error);
    } finally {
      setLoadingKec(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 }
  };

  return (
    <div className="w-screen min-h-screen bg-slate-100 text-black py-10">
      <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 p-5 mx-auto shadow-md">
        <div className="w-full flex justify-end">
          <button onClick={() => setMenu(!menu)}>
            <AlignJustify color="#000" />
          </button>
        </div>

        <h1 className="text-md font-semibold mb-4">Daftar Provinsi</h1>

        {menu && (
          <>
            {/* PROVINSI */}
            <div className="w-full h-fit p-5 bg-slate-200 mb-5 space-y-2">
              {loadingProv ? (
                <p>Loading provinsi...</p>
              ) : showProv.length < 1 ? (
                <p>Belum ada data</p>
              ) : (
                <AnimatePresence>
                  {showProv.map((item) => (
                    <motion.button
                      key={item.id}
                      {...fadeInUp}
                      className={`w-full text-left p-2 border rounded border-slate-300 hover:bg-slate-100 active:bg-green-400 ${selectedProvId === item.id ? "bg-green-500 hover:bg-green-400" : ""
                        }`}
                      onClick={() => handleSetKab(item.id)}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* KABUPATEN */}
            <div className="w-full h-fit p-5 bg-slate-200 mb-5 space-y-2">
              {loadingKab ? (
                <p>Loading kabupaten...</p>
              ) : kab.length < 1 ? (
                <p>Belum ada data</p>
              ) : (
                <AnimatePresence>
                  {kab.map((item) => (
                    <motion.button
                      key={item.id}
                      {...fadeInUp}
                      className={`w-full text-left p-2 border rounded border-slate-300 hover:bg-slate-100 active:bg-green-400 ${selectedKabId === item.id ? "bg-green-500 hover:bg-green-400" : ""
                        }`}
                      onClick={() => handleSetKec(item.id)}
                    >
                      {loadingKec && selectedKabId === item.id ? "Loading..." : item.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* KECAMATAN */}
            <div className="w-full h-fit p-5 bg-slate-200 space-y-2">
              {loadingKec ? (
                <p>Loading kecamatan...</p>
              ) : kec.length < 1 ? (
                <p>Belum ada data</p>
              ) : (
                <AnimatePresence>
                  {kec.map((item) => (
                    <motion.button
                      key={item.id}
                      {...fadeInUp}
                      className={`w-full text-left p-2 border rounded border-slate-300 hover:bg-slate-100 active:bg-green-400 ${selectedKecId === item.id ? "bg-green-500 hover:bg-green-400" : ""
                        }`}
                      onClick={() => handleSelectKecamatan(item.id)}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="w-full p-4">
          <label className="block mb-2">
            <p>Masukkan jumlah provinsi yang ingin ditampilkan (1-32)</p>
            <input
              value={count}
              onChange={(e) => handleChange(e.target.value)}
              type="number"
              min={1}
              max={32}
              className="w-full py-2 px-4 rounded border border-slate-300 outline-0"
            />
          </label>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 mt-4 text-white rounded active:bg-blue-800"
          >
            {loadingProv ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
