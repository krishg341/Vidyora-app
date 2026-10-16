import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';

type Medium = 'English';

type Chapter = {
  id: string;
  title: string;
  duration: string;
  overview: string;
  points: string[];
  questions: string[];
};

type Subject = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tint: string;
  chapters: Chapter[];
};

type Screen = 'home' | 'subjects' | 'chapters' | 'lesson';

const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

const SUBJECT_DEFINITIONS = [
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

function createSubjects(className: string, medium: Medium): Subject[] {
  return SUBJECT_DEFINITIONS.map(function (definition) {
    const titles = CHAPTER_TITLES[definition.id] || ['Introduction', 'Core Concepts', 'Practice', 'Revision'];
    const chapters = titles.map(function (title, index) {
      const chapterNumber = index + 1;
      return {
        id: className + '-' + medium + '-' + definition.id + '-' + chapterNumber,
        title: title,
        duration: (10 + chapterNumber * 5) + ' min',
        overview: 'In this lesson, you will build an understanding of ' + title + ' through simple explanations and examples.',
        points: [
          'Understand the main idea of ' + title + '.',
          'Learn important terms and connect them with everyday examples.',
          'Review the key points and practise explaining them in your own words.',
        ],
        questions: [
          'What is one important idea you learned in this chapter?',
          'Give an example related to ' + title + '.',
          'Summarise the lesson in two or three sentences.',
        ],
      } as Chapter;
    });

    return {
      id: definition.id,
      title: definition.title,
      subtitle: definition.subtitle,
      icon: definition.icon,
      tint: definition.tint,
      chapters: chapters,
    };
  });
}

function ActionButton(props: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      style={[styles.actionButton, props.secondary && styles.actionButtonSecondary]}
    >
      <Text style={[styles.actionButtonText, props.secondary && styles.actionButtonTextSecondary]}>
        {props.label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const medium: Medium = 'English';
  const [selectedClass, setSelectedClass] = useState('Class 6');
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);

  const subjects = createSubjects(selectedClass, medium);
  const selectedSubject = subjects.find(function (subject) {
    return subject.id === selectedSubjectId;
  }) || null;

  function resetToHome() {
    setScreen('home');
    setSelectedSubjectId(null);
    setSelectedChapter(null);
    setShowQuestions(false);
  }

  function chooseClass(className: string) {
    setSelectedClass(className);
    setSelectedSubjectId(null);
    setSelectedChapter(null);
    setShowQuestions(false);
    setScreen('subjects');
  }


  function openSubject(subjectId: string) {
    setSelectedSubjectId(subjectId);
    setSelectedChapter(null);
    setShowQuestions(false);
    setScreen('chapters');
  }

  function openChapter(chapter: Chapter) {
    setSelectedChapter(chapter);
    setShowQuestions(false);
    setScreen('lesson');
  }

  function toggleCompleted() {
    if (!selectedChapter) {
      return;
    }
    setCompletedIds(function (previous) {
      if (previous.indexOf(selectedChapter.id) !== -1) {
        return previous.filter(function (id) {
          return id !== selectedChapter.id;
        });
      }
      return previous.concat(selectedChapter.id);
    });
  }

  const allChapters = subjects.reduce(function (total, subject) {
    return total + subject.chapters.length;
  }, 0);
  const completedCount = subjects.reduce(function (total, subject) {
    return total + subject.chapters.filter(function (chapter) {
      return completedIds.indexOf(chapter.id) !== -1;
    }).length;
  }, 0);
  const progress = allChapters === 0 ? 0 : Math.round((completedCount / allChapters) * 100);
  const isCurrentChapterComplete = selectedChapter
    ? completedIds.indexOf(selectedChapter.id) !== -1
    : false;

  function renderHeader(showBack: boolean, backAction?: () => void) {
    return (
      <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={backAction || resetToHome}
            style={styles.headerBack}
          >
            <Text style={styles.headerBackText}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>V</Text>
          </View>
        )}
        <View style={styles.headerCopy}>
          <Text style={styles.brandName}>vidyora</Text>
          <Text style={styles.brandTagline}>LEARN • GROW • ACHIEVE</Text>
        </View>
        <View style={styles.mediumBadge}>
          <Text style={styles.mediumBadgeText}>ENGLISH</Text>
        </View>
      </View>
    );
  }

  function renderHome() {
    return (
      <>
        {renderHeader(false)}
        <View style={styles.homeHero}>
          <Text style={[styles.eyebrow, styles.heroEyebrow]}>YOUR LEARNING JOURNEY</Text>
          <Text style={styles.heroTitle}>Small steps.{'\n'}Big possibilities.</Text>
          <Text style={styles.heroBody}>English-medium learning for Classes 6–10. Choose your class to get started.</Text>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>✦</Text></View>
        </View>

        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionTitle}>Select your class</Text>
            <Text style={styles.sectionSubtitle}>Choose a grade to explore subjects.</Text>
          </View>
          <Text style={styles.gradeRange}>06 — 10</Text>
        </View>
        <View style={styles.classGrid}>
          {CLASSES.map(function (className, index) {
            const classNumber = index + 6;
            const colors = ['#E2F0DF', '#DDEFE7', '#FBE9CF', '#DCECF4', '#F7E2D8'];
            return (
              <Pressable
                key={className}
                accessibilityRole="button"
                onPress={function () { chooseClass(className); }}
                style={styles.classCard}
              >
                <View style={[styles.classNumberCircle, { backgroundColor: colors[index] }]}>
                  <Text style={styles.classNumberText}>{classNumber}</Text>
                </View>
                <Text style={styles.classCardTitle}>{className}</Text>
                <Text style={styles.classCardSubtitle}>Explore grade</Text>
                <Text style={styles.classCardArrow}>↗</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.homeNote}>
          <Text style={styles.homeNoteIcon}>✦</Text>
          <View style={styles.homeNoteCopy}>
            <Text style={styles.homeNoteTitle}>Learning made personal</Text>
            <Text style={styles.homeNoteBody}>Explore subjects, review chapter notes and track completed lessons.</Text>
          </View>
        </View>
      </>
    );
  }

  function renderSubjects() {
    return (
      <>
        {renderHeader(true, resetToHome)}
        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>YOUR CLASSROOM</Text>
          <Text style={styles.pageTitle}>{selectedClass}</Text>
          <Text style={styles.pageDescription}>
            English medium · Choose a subject to browse its chapters and lessons.
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTextRow}>
            <View style={styles.progressCopy}>
              <Text style={styles.progressTitle}>Your learning progress</Text>
              <Text style={styles.progressSubtitle}>{completedCount} of {allChapters} sample chapters completed</Text>
            </View>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progress + '%' }]} />
          </View>
        </View>

        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <Text style={styles.sectionSubtitle}>Pick a subject to continue.</Text>
          </View>
          <Text style={styles.countBadge}>{subjects.length} subjects</Text>
        </View>

        {subjects.map(function (subject, index) {
          const subjectCompleted = subject.chapters.filter(function (chapter) {
            return completedIds.indexOf(chapter.id) !== -1;
          }).length;
          return (
            <Pressable
              key={subject.id}
              accessibilityRole="button"
              onPress={function () { openSubject(subject.id); }}
              style={styles.subjectCard}
            >
              <View style={[styles.subjectIcon, { backgroundColor: subject.tint }]}>
                <Text style={styles.subjectIconText}>{subject.icon}</Text>
              </View>
              <View style={styles.subjectCopy}>
                <Text style={styles.subjectName}>{subject.title}</Text>
                <Text style={styles.subjectDescription}>{subject.subtitle}</Text>
                <Text style={styles.subjectMeta}>{subject.chapters.length} sample chapters · {subjectCompleted} completed</Text>
              </View>
              <View style={styles.subjectArrowWrap}>
                <Text style={styles.subjectArrow}>›</Text>
              </View>
            </Pressable>
          );
        })}
        <Text style={styles.footerText}>Sample curriculum · Official syllabus can be added later.</Text>
      </>
    );
  }

  function renderChapters() {
    if (!selectedSubject) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Subject not found</Text>
          <ActionButton label="Back to subjects" onPress={function () { setScreen('subjects'); }} />
        </View>
      );
    }

    return (
      <>
        {renderHeader(true, function () { setScreen('subjects'); })}
        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>{selectedClass.toUpperCase()} · SUBJECT</Text>
          <Text style={styles.pageTitle}>{selectedSubject.title}</Text>
          <Text style={styles.pageDescription}>{selectedSubject.subtitle}</Text>
        </View>
        <View style={[styles.subjectBanner, { backgroundColor: selectedSubject.tint }]}>
          <View style={styles.subjectBannerIcon}>
            <Text style={styles.subjectBannerIconText}>{selectedSubject.icon}</Text>
          </View>
          <View style={styles.subjectBannerCopy}>
            <Text style={styles.subjectBannerTitle}>Ready to learn?</Text>
            <Text style={styles.subjectBannerBody}>Choose a chapter below to open its lesson.</Text>
          </View>
        </View>
        <View style={styles.sectionHeadingRow}>
          <View>
            <Text style={styles.sectionTitle}>Chapters</Text>
            <Text style={styles.sectionSubtitle}>Work through each lesson at your pace.</Text>
          </View>
          <Text style={styles.countBadge}>{selectedSubject.chapters.length} lessons</Text>
        </View>
        <View style={styles.chapterList}>
          {selectedSubject.chapters.map(function (chapter, index) {
            const complete = completedIds.indexOf(chapter.id) !== -1;
            return (
              <Pressable
                key={chapter.id}
                accessibilityRole="button"
                onPress={function () { openChapter(chapter); }}
                style={styles.chapterCard}
              >
                <View style={[styles.chapterNumber, complete && styles.chapterNumberDone]}>
                  <Text style={[styles.chapterNumberText, complete && styles.chapterNumberTextDone]}>
                    {complete ? '✓' : String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.chapterCopy}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterMeta}>Lesson · {chapter.duration}{complete ? ' · Completed' : ''}</Text>
                </View>
                <Text style={styles.chapterArrow}>›</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.footerText}>Chapter titles are sample content for the UI prototype.</Text>
      </>
    );
  }

  function renderLesson() {
    if (!selectedSubject || !selectedChapter) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Lesson not found</Text>
          <ActionButton label="Back to chapters" onPress={function () { setScreen('chapters'); }} />
        </View>
      );
    }

    return (
      <>
        {renderHeader(true, function () { setScreen('chapters'); })}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>{selectedClass}</Text>
          <Text style={styles.breadcrumbDivider}>›</Text>
          <Text style={styles.breadcrumbText}>{selectedSubject.title}</Text>
        </View>
        <View style={styles.pageIntro}>
          <Text style={styles.eyebrow}>CHAPTER {String(selectedSubject.chapters.findIndex(function (item) { return item.id === selectedChapter.id; }) + 1).padStart(2, '0')}</Text>
          <Text style={styles.pageTitle}>{selectedChapter.title}</Text>
          <Text style={styles.pageDescription}>{selectedClass} · English medium · {selectedChapter.duration}</Text>
        </View>

        <View style={styles.videoCard}>
          <View style={styles.playCircle}><Text style={styles.playTriangle}>▶</Text></View>
          <Text style={styles.videoCardTitle}>Lesson overview</Text>
          <Text style={styles.videoCardDescription}>Video lessons can be connected here later.</Text>
        </View>

        <View style={styles.lessonSection}>
          <Text style={styles.lessonSectionTitle}>About this lesson</Text>
          <Text style={styles.lessonOverview}>{selectedChapter.overview}</Text>
        </View>

        <View style={styles.lessonSection}>
          <Text style={styles.lessonSectionTitle}>What you will learn</Text>
          {selectedChapter.points.map(function (point, index) {
            return (
              <View key={selectedChapter.id + '-point-' + index} style={styles.learningPoint}>
                <View style={styles.pointCheck}><Text style={styles.pointCheckText}>✓</Text></View>
                <Text style={styles.learningPointText}>{point}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.lessonSection}>
          <Pressable
            accessibilityRole="button"
            onPress={function () { setShowQuestions(!showQuestions); }}
            style={styles.practiceHeader}
          >
            <View style={styles.practiceIcon}><Text style={styles.practiceIconText}>?</Text></View>
            <View style={styles.practiceCopy}>
              <Text style={styles.practiceTitle}>Practice questions</Text>
              <Text style={styles.practiceSubtitle}>Check your understanding</Text>
            </View>
            <Text style={styles.practiceArrow}>{showQuestions ? '−' : '+'}</Text>
          </Pressable>
          {showQuestions ? (
            <View style={styles.questionsList}>
              {selectedChapter.questions.map(function (question, index) {
                return (
                  <View key={selectedChapter.id + '-question-' + index} style={styles.questionRow}>
                    <Text style={styles.questionNumber}>{index + 1}</Text>
                    <Text style={styles.questionText}>{question}</Text>
                  </View>
                );
              })}
              <Text style={styles.sampleNote}>These are sample questions. Official textbook questions can be added later.</Text>
            </View>
          ) : null}
        </View>

        <ActionButton
          label={isCurrentChapterComplete ? '✓  Mark as not completed' : '✓  Mark lesson as completed'}
          onPress={toggleCompleted}
          secondary={isCurrentChapterComplete}
        />
        <Text style={styles.footerText}>Keep going. Every lesson is progress.</Text>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F6FF" />
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        {screen === 'home' ? renderHome() : null}
        {screen === 'subjects' ? renderSubjects() : null}
        {screen === 'chapters' ? renderChapters() : null}
        {screen === 'lesson' ? renderLesson() : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6FF',
  },
  page: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 48,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6D4AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },
  headerBack: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  headerBackText: {
    color: '#34265A',
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
  },
  headerCopy: {
    flex: 1,
    marginLeft: 11,
  },
  brandName: {
    color: '#2C2145',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  brandTagline: {
    color: '#89819F',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 3,
  },
  mediumBadge: {
    minWidth: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  mediumBadgeText: {
    color: '#6D4AFF',
    fontSize: 9,
    fontWeight: '900',
  },
  homeHero: {
    backgroundColor: '#4D2DA8',
    borderRadius: 26,
    paddingHorizontal: 23,
    paddingVertical: 27,
    marginBottom: 28,
    overflow: 'hidden',
  },
  eyebrow: {
    color: '#8066E8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  heroEyebrow: {
    color: '#DCD2FF',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  heroBody: {
    color: '#EAE4FF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: '88%',
  },
  heroBadge: {
    position: 'absolute',
    right: 20,
    top: 23,
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#FFCA70',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeText: {
    color: '#4D2DA8',
    fontSize: 26,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#2C2145',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: '#89819F',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 14,
  },
  gradeRange: {
    color: '#8066E8',
    fontSize: 11,
    fontWeight: '900',
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 21,
  },
  classCard: {
    width: '48.3%',
    minHeight: 126,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1F5',
    borderRadius: 19,
    padding: 14,
    marginBottom: 12,
  },
  classNumberCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  classNumberText: {
    color: '#2C2145',
    fontSize: 19,
    fontWeight: '900',
  },
  classCardTitle: {
    color: '#30234A',
    fontSize: 14,
    fontWeight: '900',
  },
  classCardSubtitle: {
    color: '#89819F',
    fontSize: 10,
    marginTop: 5,
  },
  classCardArrow: {
    position: 'absolute',
    right: 13,
    bottom: 12,
    color: '#8066E8',
    fontSize: 18,
    fontWeight: '700',
  },
  homeNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0EBFF',
    borderRadius: 17,
    padding: 15,
    marginTop: 3,
  },
  homeNoteIcon: {
    color: '#6D4AFF',
    fontSize: 19,
    marginRight: 11,
  },
  homeNoteCopy: {
    flex: 1,
  },
  homeNoteTitle: {
    color: '#30234A',
    fontSize: 13,
    fontWeight: '900',
  },
  homeNoteBody: {
    color: '#716783',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  pageIntro: {
    marginBottom: 21,
  },
  pageTitle: {
    color: '#2C2145',
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  pageDescription: {
    color: '#827A98',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1F5',
    borderRadius: 19,
    padding: 17,
    marginBottom: 28,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressCopy: {
    flex: 1,
  },
  progressTitle: {
    color: '#2C2145',
    fontSize: 13,
    fontWeight: '900',
  },
  progressSubtitle: {
    color: '#89819F',
    fontSize: 10,
    marginTop: 5,
  },
  progressPercent: {
    color: '#6D4AFF',
    fontSize: 23,
    fontWeight: '900',
    marginLeft: 10,
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#EAE5FA',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 5,
    backgroundColor: '#7B5CE1',
  },
  countBadge: {
    color: '#6D4AFF',
    backgroundColor: '#EEE9FF',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    overflow: 'hidden',
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1F5',
    borderRadius: 19,
    padding: 13,
    marginBottom: 11,
  },
  subjectIcon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectIconText: {
    color: '#30234A',
    fontSize: 23,
    fontWeight: '900',
  },
  subjectCopy: {
    flex: 1,
    marginLeft: 13,
    marginRight: 7,
  },
  subjectName: {
    color: '#2C2145',
    fontSize: 14,
    fontWeight: '900',
  },
  subjectDescription: {
    color: '#827A98',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  subjectMeta: {
    color: '#8066E8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 6,
  },
  subjectArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectArrow: {
    color: '#7B5CE1',
    fontSize: 22,
    lineHeight: 24,
  },
  subjectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 17,
    marginBottom: 28,
  },
  subjectBannerIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  subjectBannerIconText: {
    color: '#30234A',
    fontSize: 24,
    fontWeight: '900',
  },
  subjectBannerCopy: {
    flex: 1,
  },
  subjectBannerTitle: {
    color: '#2C2145',
    fontSize: 14,
    fontWeight: '900',
  },
  subjectBannerBody: {
    color: '#726985',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  chapterList: {
    marginTop: 1,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1F5',
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingVertical: 15,
    marginBottom: 10,
  },
  chapterNumber: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberDone: {
    backgroundColor: '#E1D9FF',
  },
  chapterNumberText: {
    color: '#6D4AFF',
    fontSize: 12,
    fontWeight: '900',
  },
  chapterNumberTextDone: {
    color: '#5A38C8',
    fontSize: 17,
  },
  chapterCopy: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  chapterTitle: {
    color: '#2C2145',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  chapterMeta: {
    color: '#89819F',
    fontSize: 10,
    marginTop: 5,
  },
  chapterArrow: {
    color: '#8066E8',
    fontSize: 25,
    paddingHorizontal: 3,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    color: '#8066E8',
    fontSize: 10,
    fontWeight: '800',
  },
  breadcrumbDivider: {
    color: '#B1B1C0',
    fontSize: 15,
    marginHorizontal: 8,
  },
  videoCard: {
    minHeight: 190,
    borderRadius: 22,
    backgroundColor: '#3F248E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 19,
  },
  playCircle: {
    width: 53,
    height: 53,
    borderRadius: 27,
    backgroundColor: '#7B5CE1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  playTriangle: {
    color: '#FFFFFF',
    fontSize: 19,
    marginLeft: 3,
  },
  videoCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  videoCardDescription: {
    color: '#E1D8FF',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  lessonSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E1F5',
    borderRadius: 19,
    padding: 17,
    marginBottom: 14,
  },
  lessonSectionTitle: {
    color: '#2C2145',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 11,
  },
  lessonOverview: {
    color: '#6F7086',
    fontSize: 12,
    lineHeight: 20,
  },
  learningPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pointCheck: {
    width: 21,
    height: 21,
    borderRadius: 7,
    backgroundColor: '#E1D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  pointCheckText: {
    color: '#5A38C8',
    fontSize: 12,
    fontWeight: '900',
  },
  learningPointText: {
    flex: 1,
    color: '#6F7086',
    fontSize: 12,
    lineHeight: 19,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  practiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F0EBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceIconText: {
    color: '#6D4AFF',
    fontSize: 20,
    fontWeight: '900',
  },
  practiceCopy: {
    flex: 1,
    marginLeft: 11,
  },
  practiceTitle: {
    color: '#2C2145',
    fontSize: 13,
    fontWeight: '900',
  },
  practiceSubtitle: {
    color: '#89819F',
    fontSize: 10,
    marginTop: 4,
  },
  practiceArrow: {
    color: '#6D4AFF',
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  questionsList: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEF4',
    marginTop: 15,
    paddingTop: 14,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionNumber: {
    color: '#6D4AFF',
    fontSize: 11,
    fontWeight: '900',
    marginRight: 10,
    marginTop: 2,
  },
  questionText: {
    color: '#726985',
    fontSize: 12,
    lineHeight: 19,
    flex: 1,
  },
  sampleNote: {
    color: '#9999AA',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },
  actionButton: {
    minHeight: 49,
    borderRadius: 15,
    backgroundColor: '#6D4AFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginTop: 2,
  },
  actionButtonSecondary: {
    backgroundColor: '#E8E0FF',
    borderWidth: 1,
    borderColor: '#D4C8FF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  actionButtonTextSecondary: {
    color: '#5A38C8',
  },
  footerText: {
    color: '#A09AB2',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginTop: 20,
  },
  emptyStateTitle: {
    color: '#2C2145',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
});
