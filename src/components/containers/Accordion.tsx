import { createSignal, JSX } from "solid-js";
import { styled } from "solid-styled-components";
import { IconButton } from "@suid/material";
import ExpandMoreIcon from "@suid/icons-material/ExpandMore";

interface AccordionProps {
  open?: boolean;
  title: string;
  children: JSX.Element;
}

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const AccordionContent = styled.div`
  padding-top: 8px;
`;

const ExpandIcon = styled(IconButton)<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
  transition: transform 0.3s ease-out;
`;

export const Accordion = (props: AccordionProps) => {
  const [isOpen, setIsOpen] = createSignal(props?.open ?? false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen());
  };

  return (
    <div class="accordion">
      <AccordionHeader onClick={toggleAccordion} class="accordion-header">
        {props.title}
        <ExpandIcon isOpen={isOpen()}>
          <ExpandMoreIcon />
        </ExpandIcon>
      </AccordionHeader>
      {isOpen() && <AccordionContent class="accordion-content">{props.children}</AccordionContent>}
    </div>
  );
};
