import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="w-full p-5 flex">
      <div />

      <div className="flex items-center gap-4 ml-auto">
        <p className="font-bold text-foreground/90 text-lg">built by - </p>

        <div className="flex gap-2">
          {[
            {
              href: "https://github.com/denosaurabh",
              image: "/images/deno.png",
            },
            {
              href: "https://github.com/0xSachinK",
              image: "/images/sachin.png",
            },
            {
              href: "https://github.com/maceip",
              image: "/images/ryan.jpeg",
            },
          ].map(({ href, image }, i) => (
            <Link key={i} href={href} target="_blank">
              <Image
                className="rounded-full shadow-sm border border-foreground/50"
                src={image}
                alt="deno"
                width={50}
                height={50}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
