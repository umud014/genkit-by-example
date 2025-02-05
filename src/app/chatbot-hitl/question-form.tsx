import { useState, useCallback } from "react";
import type { Answer, Question } from "./schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QuestionForm({
  question,
  answer,
  send,
}: {
  question: Question;
  answer?: Answer;
  send: (answer: Answer) => any;
}) {
  // Track if the question has been answered
  const hasAnswer = answer !== undefined;

  // Initialize state with existing answer if any
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    Array.isArray(answer?.answer)
      ? answer.answer
      : answer?.answer
      ? [answer.answer]
      : []
  );
  const [customAnswer, setCustomAnswer] = useState<string>(
    !question.choices.includes(answer?.answer as string) &&
      !Array.isArray(answer?.answer)
      ? (answer?.answer as string) || ""
      : ""
  );

  const handleChoiceChange = (choice: string, checked: boolean) => {
    // Don't allow changes if already answered
    if (hasAnswer) return;

    let newChoices: string[];
    if (question.allowMultiple) {
      newChoices = checked
        ? [...selectedChoices, choice]
        : selectedChoices.filter((c) => c !== choice);
    } else {
      newChoices = checked ? [choice] : [];
    }
    setSelectedChoices(newChoices);
  };

  const handleCustomChange = (value: string) => {
    // Don't allow changes if already answered
    if (hasAnswer) return;

    setCustomAnswer(value);
  };

  const handleSubmit = useCallback(() => {
    if (selectedChoices.length > 0) {
      send({
        answer: question.allowMultiple ? selectedChoices : selectedChoices[0],
      });
    } else if (customAnswer.trim()) {
      send({ answer: customAnswer });
    }
  }, [selectedChoices, customAnswer, question.allowMultiple, send]);

  return (
    <Card className="my-4 max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
        {hasAnswer && (
          <div className="text-sm text-muted-foreground mt-2">
            Answer submitted: {selectedChoices.join(", ")}
          </div>
        )}
      </CardHeader>
      {!hasAnswer && (
        <CardContent className="space-y-4">
          {question.choices.map((choice) => (
            <div key={choice} className="flex items-center space-x-2">
              <Input
                type={question.allowMultiple ? "checkbox" : "radio"}
                id={choice}
                name="answer"
                checked={selectedChoices.includes(choice)}
                onChange={(e) => handleChoiceChange(choice, e.target.checked)}
                className="w-4 h-4"
                disabled={hasAnswer}
              />
              <label htmlFor={choice} className="text-sm">
                {choice}
              </label>
            </div>
          ))}
          {question.allowCustom && (
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Or write your own answer..."
                value={customAnswer}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full"
                disabled={hasAnswer}
              />
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={hasAnswer}
            variant="outline"
            className="mt-4 w-full"
          >
            Submit
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
