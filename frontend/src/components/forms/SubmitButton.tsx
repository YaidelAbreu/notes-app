import FormButton from "./FormButton";
import { ButtonColor } from "../../constants";

type SubmitButtonProps = {
  onClick: () => void;
};

export default function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <FormButton color={ButtonColor.Primary} onClick={onClick} text="Confirm" />
  );
}
