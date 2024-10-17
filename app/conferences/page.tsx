"use client";
import { createConference } from "@/actions/accountActions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

function Conferences() {
  return (
    <>
      <div>Conferences</div>
      <Button onClick={() => createConference()}>
        <Plus />
      </Button>
    </>
  );
}

export default Conferences;
