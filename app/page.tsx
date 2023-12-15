'use client'
import Image from "next/image";
import dynamic, { noSSR } from "next/dynamic";
import { useEffect, useMemo, useState } from "react";


export default function Home() {

  const DynamicMap = useMemo(() => dynamic(
    () => import('@/components/Maps'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])


  const [results, setResults] = useState({
    ipAddress: '-',
    location: "-",
    region: "-",
    postcode: "-",
    timezone: "-",
    isp: "-",
    lat: 51.505,
    lng: -0.09,
  });

  const [ipAddress, setIpAddress] = useState('');
  const ipAddressRegex =
    /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]).){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/g
;

  const fetchData = async () => {
    console.log(ipAddress);
    if (ipAddressRegex.test(ipAddress) || ipAddress === "") {
      console.log('match');
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_sjUEMdBpi0XOaHXCQtD9OrAxekdRY&ipAddress=${ipAddress}`
      );
      const data = await response.json();
      console.log(data);
      setResults({
        ipAddress: ipAddress,
        location: data.location.city,
        region: data.location.region,
        postcode: data.location.postalCode,
        timezone: data.location.timezone,
        isp: data.isp,
        lat: data.location.lat,
        lng: data.location.lng,
      });
    } else console.log('no match');; 
    
  };



  // useEffect(() => {
  //   console.log(results);
  // }, [results]);

  return (
    <div className="flex flex-col max-h-full">
      <div className="h-[300px] bg-[url(/images/pattern-bg-mobile.png)] bg-no-repeat bg-cover overflow-visible">
        <h1 className="text-center text-3xl py-8">IP Address Tracker</h1>
        <div className="flex rounded-md w-full h-[60px] px-6">
          <input
            type="text"
            name="ip-address"
            id="ip-address"
            onChange={(e) => setIpAddress(e.target.value)}
            className="rounded-s-lg w-full text-very-dark-gray"
            // pattern="(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)_*(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)_*){3}"
          />
          <button
            type="submit"
            className="w-[60px] bg-black rounded-r-lg flex items-center justify-center"
            onClick={fetchData}
          >
            <Image src="/images/icon-arrow.svg" width={15} height={15} alt="" />
          </button>
        </div>
        <div className="bg-white text-black mx-6 mt-6 rounded-lg text-center relative top-0 bottom-0 z-50 flex flex-col gap-5 py-6">
          <div>
            <p className="text-dark-gray text-xs font-semibold">IP ADDRESS</p>
            <p className="text-very-dark-gray font-medium text-lg">{results.ipAddress}</p>
          </div>
          <div>
            <p className="text-dark-gray text-xs font-semibold">LOCATION</p>
            <p className="text-very-dark-gray font-medium text-lg">
              {results.location}, {results.region}, {results.postcode}
            </p>
          </div>
          <div>
            <p className="text-dark-gray text-xs font-semibold">TIMEZONE</p>
            <p className="text-very-dark-gray font-medium text-lg">
              UTC {results.timezone}
            </p>
          </div>
          <div>
            <p className="text-dark-gray text-xs font-semibold">ISP</p>
            <p className="text-very-dark-gray font-medium text-lg">
              {results.isp}
            </p>
          </div>
        </div>
      </div>
      <div className="z-40">
        <DynamicMap position={[results.lat, results.lng]} />
      </div>
    </div>
  );
}
