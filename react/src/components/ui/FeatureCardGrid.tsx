import React, { forwardRef } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { ArrowRight, MoreHorizontal } from "lucide-react";

export type Action = {
  id: string;
  label: string;
  onClick?: () => void;
  variant?: "ghost" | "default" | "secondary";
};

export type FeatureCardProps = {
  id?: string;
  title: string;
  description?: string;
  imageSrc?: string;
  tags?: string[];
  actions?: Action[];
  className?: string;
  // Optional pluggable UI components (e.g. from Magic UI)
  TooltipComponent?: React.ComponentType<any> | null;
  MenuComponent?: React.ComponentType<any> | null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.99 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06 },
  }),
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(2,6,23,0.12)" },
};

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      id,
      title,
      description,
      imageSrc,
      tags = [],
      actions = [],
      className = "",
      TooltipComponent = null,
      MenuComponent = null,
    },
    ref
  ) => {
    const Tooltip = TooltipComponent ?? (({ children }: any) => <>{children}</>);
    const Menu = MenuComponent;

    return (
      <motion.div
        ref={ref}
        layout
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, amount: 0.2 }}
        custom={Math.random()}
        variants={cardVariants}
        className={`w-full max-w-sm rounded-2xl overflow-hidden ${className}`}
      >
        <Card className="overflow-hidden">
          {imageSrc && (
            <div className="relative h-44 w-full bg-muted/40">
              <img
                src={imageSrc}
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <CardHeader className="p-4">
            <CardTitle className="text-lg truncate">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2 text-sm">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Tooltip key={t} content={`Tag: ${t}`}>
                  <Badge className="capitalize">{t}</Badge>
                </Tooltip>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {actions.slice(0, 2).map((a) => (
                <Button
                  key={a.id}
                  onClick={a.onClick}
                  variant={a.variant ?? "ghost"}
                  className="inline-flex items-center gap-2"
                >
                  <span>{a.label}</span>
                  <ArrowRight size={14} />
                </Button>
              ))}
            </div>

            {actions.length > 2 && (
              <div className="flex-shrink-0">
                {Menu ? (
                  <Menu actions={actions.slice(2)} />
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 w-40">
                      <ul className="flex flex-col gap-1">
                        {actions.slice(2).map((a) => (
                          <li key={a.id}>
                            <Button
                              onClick={a.onClick}
                              variant={a.variant ?? "ghost"}
                              className="w-full justify-start"
                            >
                              {a.label}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

type GridProps = {
  items: FeatureCardProps[];
  columns?: number;
  gap?: string;
  TooltipComponent?: React.ComponentType<any> | null;
  MenuComponent?: React.ComponentType<any> | null;
};

function FeatureCardGrid({
  items,
  columns = 3,
  gap = "gap-6",
  TooltipComponent = null,
  MenuComponent = null,
}: GridProps) {
  const colsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    }[columns] ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <motion.div className={`grid ${colsClass} ${gap}`}>
      {items.map((it, idx) => (
        <FeatureCard
          key={it.id ?? idx}
          {...it}
          TooltipComponent={TooltipComponent}
          MenuComponent={MenuComponent}
        />
      ))}
    </motion.div>
  );
}

export default FeatureCardGrid