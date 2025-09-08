import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards2() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card  grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-[#FE9F43] text-white">
        <CardHeader>
          <CardDescription className="text-white">
            Total Revenue
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge className="bg-white text-[#fe9f43]" variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#092C4C]">
        <CardHeader>
          <CardDescription className="text-white">
            New Customers
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge className=" bg-white text-[#092C4C]" variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#0E9384]">
        <CardHeader>
          <CardDescription className="text-white">
            Active Accounts
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge className="bg-white text-[#0E9384]" variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#155EEF]">
        <CardHeader>
          <CardDescription className="text-white">Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge className="bg-white text-[#155EEF]" variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
