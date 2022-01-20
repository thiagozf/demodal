import React from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Unmodal, useModal } from "react-unmodal";
import { muiDialog } from "react-unmodal/material-ui";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyMuiModal = Unmodal.create(({ name }: { name: string }) => {
  const modal = useModal();

  const resolve = (value: boolean) => () => {
    modal.resolve(value);
    modal.close();
  };

  return (
    <Dialog TransitionComponent={Transition} {...muiDialog(modal)}>
      <DialogTitle id="alert-dialog-slide-title">Hello, {name}!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Let Unmodal help you with the heavy lifting{" "}
          <span role="img" aria-label="">
            😎
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={resolve(false)} color="primary">
          Disagree
        </Button>
        <Button onClick={resolve(true)} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const Page = () => {
  const handleClick = async () => {
    const result = await Unmodal.open(MyMuiModal, { name: "World" });
    console.log(result);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Button variant="contained" onClick={handleClick} color="primary">
        Open Modal
      </Button>
    </Box>
  );
};

function App() {
  return (
    <Unmodal.Provider>
      <Page />
    </Unmodal.Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
