import { styled } from "solid-styled-components";
import { IconButton, Modal as MaterialModal } from "@suid/material";
import Close from "@suid/icons-material/Close";
const ModalContent = styled.div`
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props?.theme?.colors.lightBackground};
`;

const IconButtonStyled = styled(IconButton)`
  position: absolute !important;
  top: 20px;
  right: 20px;
  svg {
    width: 24px;
  }
`;

export const Modal = ({ onClose, children }: { onClose: () => void; children: any }) => {
  return (
    <MaterialModal open={true} onClose={onClose}>
      <ModalContent>
        <IconButtonStyled onClick={onClose} sx={{ alignSelf: "flex-end" }}>
          <Close />
        </IconButtonStyled>
        {children}
      </ModalContent>
    </MaterialModal>
  );
};
