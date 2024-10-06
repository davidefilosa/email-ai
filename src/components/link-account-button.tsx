"use client";

import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Button } from "./ui/button";

export const LinkAccountButton = ({
  serviceType,
}: {
  serviceType: "Google" | "Office65";
}) => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl(serviceType);
        console.log(authUrl);
      }}
    >
      Link {serviceType}
    </Button>
  );
};
