"use client";
import Image from "next/image";
import dynamic, { noSSR } from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const DynamicMap = useMemo(
    () =>
      dynamic(() => import("@/components/Maps"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  // API results
  const [results, setResults] = useState({
    ipAddress: "-",
    location: "-",
    region: "-",
    country: "-",
    timezone: "-",
    isp: "-",
    lat: 51.505,
    lng: -0.09,
  });
  // Error message state
  const [error, setError] = useState("");
  // user input state
  const [input, setInput] = useState("");
  // input is valid or not
  const [isValid, setIsValid] = useState(true);
  // retrive Ip address on loading
  async function fetchInitialData() {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_9z6vrAsAXoFCIufRgFJSwzFneydEA&ipAddress=`
    );
    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    } else {
      const data = await response.json();
      setResults({
        ipAddress: data.ip,
        location: data.location.city,
        region: data.location.region,
        country: data.location.country,
        timezone: data.location.timezone,
        isp: data.isp,
        lat: data.location.lat,
        lng: data.location.lng,
      });
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  // pattern for valid IP address
  const ipAddressRegex =
    /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]).){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/g;
  // pattern for valid domain name
  const domainRegex =
    /^((?!-))(xn--)?[a-zA-Z0-9][[a-zA-Z0-9-_]{0,61}[[a-zA-Z0-9]{0,1}\.(xn--)?([[a-zA-Z0-9\-]{1,61}|[[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,})$/;
  // fetch API data on user sumbission
  const fetchData = async () => {
    if (ipAddressRegex.test(input) || input === "") {
      setIsValid(true);
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_9z6vrAsAXoFCIufRgFJSwzFneydEA&ipAddress=${input}`
      );

      const data = await response.json();
      setResults({
        ipAddress: data.ip,
        location: data.location.city,
        region: data.location.region,
        country: data.location.country,
        timezone: data.location.timezone,
        isp: data.isp,
        lat: data.location.lat,
        lng: data.location.lng,
      });
    } else if (domainRegex.test(input)) {
      setIsValid(true);
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_9z6vrAsAXoFCIufRgFJSwzFneydEA&domain=${input.toLowerCase()}`
      );
      if (!response.ok) {
        setIsValid(false);
        setError("Domain not found, try again!");
      } else {
        const data = await response.json();
        setResults({
          ipAddress: data.ip,
          location: data.location.city,
          region: data.location.region,
          country: data.location.country,
          timezone: data.location.timezone,
          isp: data.isp,
          lat: data.location.lat,
          lng: data.location.lng,
        });
      }
    } else {
      setIsValid(false);
      setError("Enter a valid IP Address or domain!");
    }
  };

  return (
    <div className="flex flex-col max-h-full">
      <div className="h-[300px] bg-[url(/images/pattern-bg-mobile.png)] bg-no-repeat bg-cover overflow-visible">
        <h1 className="text-center text-3xl py-8">IP Address Tracker</h1>
        {/* User Input */}
        <div className="flex rounded-md max-w-[556px] h-[60px] px-6 justify-center mx-auto">
          <input
            type="text"
            name="ip-address"
            id="ip-address"
            onChange={(e) => setInput(e.target.value)}
            className="rounded-s-lg w-full text-very-dark-gray form-input"
            placeholder="Search for an IP address or domain"
          />
          <button
            type="submit"
            className="w-[60px] bg-black rounded-r-lg flex items-center justify-center hover:bg-very-dark-gray"
            onClick={fetchData}
            aria-label="Search"
          >
            <Image
              src="/images/icon-arrow.svg"
              width={15}
              height={15}
              alt="search"
            />
          </button>
        </div>
        {/* Error message */}
        <p
          className={`mt-3 max-w-[556px] mx-auto text-sm text-center ${
            isValid ? "hidden" : "block"
          } text-white outline-double font-bold`}
        >
          {error}
        </p>
        {/* Dashboard with search results */}
        <div className="bg-white text-black mx-6 mt-6 rounded-lg text-center relative top-0 bottom-0 z-50 flex flex-col gap-5 py-6 md:flex-row md:text-left md:justify-evenly md:items-start ">
          <div className="md:px-[30px] md:py-10 flex-1 md:w-[24%]">
            <p className="text-dark-gray text-xs font-semibold">IP ADDRESS</p>
            <p className="text-very-dark-gray font-medium text-lg md:text-2xl">
              {results.ipAddress}
            </p>
          </div>
          <div className="h-20 w-px bg-dark-gray hidden md:block self-center "></div>
          <div className="md:px-[30px] md:py-10 flex-1 md:w-[24%]">
            <p className="text-dark-gray text-xs font-semibold">LOCATION</p>
            <p className="text-very-dark-gray font-medium text-lg md:text-2xl">
              {results.location}, {results.region}, {results.country}
            </p>
          </div>
          <div className="h-20 w-px bg-dark-gray hidden md:block self-center"></div>
          <div className="md:px-[30px] md:py-10 flex-1 md:w-[24%]">
            <p className="text-dark-gray text-xs font-semibold">TIMEZONE</p>
            <p className="text-very-dark-gray font-medium text-lg md:text-2xl">
              UTC {results.timezone}
            </p>
          </div>
          <div className="h-20 w-px bg-dark-gray hidden md:block self-center"></div>
          <div className="md:px-[30px] md:py-10 flex-1 md:w-[24%]">
            <p className="text-dark-gray text-xs font-semibold">ISP</p>
            <p className="text-very-dark-gray font-medium text-lg md:text-2xl">
              {results.isp}
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="z-40">
        <DynamicMap position={[results.lat, results.lng]} />
      </div>
    </div>
  );
}
