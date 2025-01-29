import { Card, CardContent } from "@/components/ui/card";
import { demos } from "@/data";
import Link from "next/link";

export default function Home() {
  return (
    <div className="my-4 max-w-screen-md mx-auto">
      <h1 className="text-4xl text-center mt-6 mb-4 font-semibold">
        <strong>Genkit</strong> by Example
      </h1>
      <p>
        This repository contains a set of pre-built examples of using Firebase Genkit to build a
        variety of AI-powered features for Next.js applications. Choose an example on the left or
        click a link below to get started:
      </p>
      <Card className="p-4 mt-6">
        <table>
          {demos.map((d) => (
            <tr className="border-b border-zinc-800 last:border-none" key={d.id}>
              <th scope="col" className="text-nowrap text-lg p-2">
                <Link href={`/${d.id}`} className="p-4 hover:bg-zinc-800 underline rounded-lg">
                  {d.name}
                </Link>
              </th>
              <td className="text p-2">{d.description}</td>
            </tr>
          ))}
        </table>
      </Card>
    </div>
  );
}
