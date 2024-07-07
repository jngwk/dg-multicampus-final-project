import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BasicCard({
  header,
  type,
  shortDesc,
  desc,
  button = { label: "", onClick: "" },
}) {
  return (
    <Card sx={{ width: 400, minWidth: 400 }} className="relative hover:bg-orange-100 p-5 ">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary"  gutterBottom>
          {type}
        </Typography>
        <Typography variant="h5" component="div">
          {header}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className="absolute right-0 pr-7">
          {shortDesc}
        </Typography>
        <Typography variant="body2">{desc}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={button.onClick}>
          {button.label}
        </Button>
      </CardActions>
    </Card>
  );
}
