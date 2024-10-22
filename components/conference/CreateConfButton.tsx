"use client";
import { createConference } from "@/actions/accountActions";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

function CreateConfButton() {
  return (
    <Button onClick={() => createConference()}>
      <Plus />
    </Button>
  );
}

export default CreateConfButton;
