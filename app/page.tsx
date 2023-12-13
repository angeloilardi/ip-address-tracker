

import dynamic, { noSSR } from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/Maps"), {ssr:false})

export default function Home() {

  return (
    <div>
      <DynamicMap />
    </div>
  );
}
