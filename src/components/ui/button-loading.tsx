import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, type ButtonProps } from "@/components/ui/button";

export function ButtonLoading({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & ButtonProps) {
  return (
    <Button disabled {...props}>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      {children}
    </Button>
  );
}
