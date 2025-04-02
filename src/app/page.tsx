'use client';

import { useState, useEffect } from "react";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/data-schema";
import { Amplify } from "aws-amplify";
import outputs from "./../../amplify_outputs.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function Home() {
  const [exams, setExams] = useState<Array<Schema["Exam"]["type"]>>([]);
  const [examResults, setExamResults] = useState<Array<Schema["Result"]["type"]>>([]);
  const [shownExamID, setShownExamID] = useState('FAKE-ID');

  function listExams() {
    client.models.Exam.observeQuery().subscribe({
      next: (data) => setExams([...data.items]),
    });
  }

  function listExamResults(examID: string) {
    client.models.Result.observeQuery({ filter: { examId: { eq: examID}} }).subscribe({
      next: (data) => setExamResults([...data.items]),
    });
  }

  function examResultsTable() {
    if (examResults == null) {
      return <p></p>
    } else {
      return (
        <Table className="w-xs center pl-30 pr-30">
          <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Student Name</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {examResults.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{res.studentName}</TableCell>
                  <TableCell className="text-right">{res.grade}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
    )}
  }

  function changeShownExamID(examID: string) {
    setShownExamID(examID);
    listExamResults(examID);
  }

  function formatDateToHumanReadable(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formattedDate = new Intl.DateTimeFormat(undefined, options).format(date);  
    return formattedDate;
  }

  useEffect(() => {
    listExams();
  }, []);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Accordion
          type="single"
          collapsible
          className="w-full pl-40 pr-40"
          value={`${shownExamID}`}
          onValueChange={(value) => changeShownExamID(value)}
        >
          {exams.map((exam) => (
            <AccordionItem value={exam.id} key={exam.id}>
              <AccordionTrigger>
                {exam.date == null ? 'No date': formatDateToHumanReadable(exam.date)  + ', '}
                {exam.subject}
                </AccordionTrigger>
              <AccordionContent>{examResultsTable()}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  );
}
