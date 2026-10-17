/** Curriculum seed - mirrors the Class 6-10 sample content used by the app (English medium). */

export const MEDIUM = 'English';

type SeedClass = { id: string; name: string; number: number };

type SeedSubject = { id: string; title: string; subtitle: string; icon: string; tint: string; position: number };

type SeedChapter = {
  id: string;
  classId: string;
  subjectId: string;
  medium: string;
  number: number;
  title: string;
  duration: string;
  overview: string;
  points: string[];
  questions: string[];
};

const SUBJECTS = [
  { id: 'maths', title: 'Mathematics', subtitle: 'Numbers, patterns and problem-solving', icon: '∑', tint: '#E9E8FF' },
  { id: 'science', title: 'Science', subtitle: 'Explore the world around you', icon: '⚗', tint: '#E1D9FF' },
  { id: 'english', title: 'English', subtitle: 'Reading, writing and communication', icon: 'A', tint: '#FFE9D8' },
  { id: 'telugu', title: 'Telugu', subtitle: 'భాష, పఠనం మరియు రచన', icon: 'అ', tint: '#FCE4EF' },
  { id: 'social', title: 'Social Studies', subtitle: 'History, geography and society', icon: '◎', tint: '#DFF0FF' },
];

const CHAPTER_TITLES: Record<string, string[]> = {
  maths: ['Knowing Our Numbers', 'Whole Numbers', 'Playing with Numbers', 'Basic Geometrical Ideas'],
  science: ['Food and Its Sources', 'Components of Food', 'Fibre to Fabric', 'Sorting Materials'],
  english: ['Reading and Comprehension', 'Grammar Basics', 'Vocabulary Builder', 'Writing Practice'],
  telugu: ['పాఠం పరిచయం', 'పదజాలం', 'వ్యాకరణం', 'రచనా నైపుణ్యాలు'],
  social: ['Our Earth', 'Maps and Globes', 'Early Human Life', 'Our Community'],
};

export function buildSeed() {
  const classes: SeedClass[] = [];
  const subjects: SeedSubject[] = SUBJECTS.map((subject, index) => ({ ...subject, position: index + 1 }));
  const chapters: SeedChapter[] = [];

  for (let grade = 6; grade <= 10; grade++) {
    const classId = `class-${grade}`;
    classes.push({ id: classId, name: `Class ${grade}`, number: grade });

    for (const subject of subjects) {
      const titles = CHAPTER_TITLES[subject.id] ?? ['Introduction', 'Core Concepts', 'Practice', 'Revision'];
      titles.forEach((title, index) => {
        const number = index + 1;
        chapters.push({
          id: `${classId}-${MEDIUM.toLowerCase()}-${subject.id}-${number}`,
          classId,
          subjectId: subject.id,
          medium: MEDIUM,
          number,
          title,
          duration: `${10 + number * 5} min`,
          overview: `In this lesson, you will build an understanding of ${title} through simple explanations and examples.`,
          points: [
            `Understand the main idea of ${title}.`,
            'Learn important terms and connect them with everyday examples.',
            'Review the key points and practise explaining them in your own words.',
          ],
          questions: [
            'What is one important idea you learned in this chapter?',
            `Give an example related to ${title}.`,
            'Summarise the lesson in two or three sentences.',
          ],
        });
      });
    }
  }

  return { classes, subjects, chapters };
}
