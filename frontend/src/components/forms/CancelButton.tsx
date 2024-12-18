import FormButton from "./FormButton";
import { ButtonColor } from "../../constants";

type CancelButtonProps = {
  onClick: () => void;
};

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <FormButton color={ButtonColor.Inherit} onClick={onClick} text="Cancel" />
  );
}
