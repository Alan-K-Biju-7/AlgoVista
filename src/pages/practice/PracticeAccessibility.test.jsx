import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProblemDetail from './ProblemDetail';
import twoSum from './neetcode150/problems/arrays-hashing/two-sum';

vi.mock('./CodeEditor', () => ({
  default: function MockCodeEditor({ value, onChange, language = 'javascript' }) {
    return (
      <textarea
        aria-label={`${language} code editor`}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
    );
  },
}));

vi.mock('./testRunner', () => ({
  runTestsAsync: vi.fn(async () => []),
}));

function renderProblem(overrides = {}) {
  const props = {
    problem: twoSum,
    topicColor: '#00d4aa',
    onBack: vi.fn(),
    onSolved: vi.fn(),
    onAttempted: vi.fn(),
    isBookmarked: () => false,
    toggleBookmark: vi.fn(),
    status: 'unsolved',
    nextProblem: null,
    onNextProblem: vi.fn(),
    practiceMode: 'learn',
    onPracticeModeChange: vi.fn(),
    practiceRecord: {},
    onHintViewed: vi.fn(),
    onSolutionViewed: vi.fn(),
    onReflect: vi.fn(),
    ...overrides,
  };

  return {
    ...render(
      <div>
        <button type="button">Outside workspace</button>
        <ProblemDetail {...props} />
      </div>
    ),
    props,
  };
}

describe('practice workspace accessibility', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.confirm = vi.fn(() => true);
  });

  test('expanded editor is modal, traps focus, closes with Escape, and returns focus', async () => {
    renderProblem();
    userEvent.click(screen.getByRole('tab', { name: 'Editor' }));
    await screen.findByLabelText(/javascript code editor/i);

    const outsideButton = screen.getByRole('button', { name: 'Outside workspace' });
    const expandButton = screen.getByRole('button', { name: 'Expand editor' });
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    userEvent.click(expandButton);

    const dialog = screen.getByRole('dialog', { name: 'Code' });
    const exitButton = within(dialog).getByRole('button', { name: 'Exit focus' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(exitButton).toHaveFocus();
    expect(outsideButton.closest('[inert]')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');

    outsideButton.focus();
    fireEvent.keyDown(outsideButton, { key: 'Tab' });
    expect(dialog).toContainElement(document.activeElement);

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Code' })).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Expand editor' })).toHaveFocus();
    expect(outsideButton.closest('[inert]')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  test('workspace arrows move focus without activating or recording Solution', async () => {
    const onSolutionViewed = vi.fn();
    renderProblem({ onSolutionViewed });

    const workspaceTabs = within(screen.getByRole('tablist', { name: 'Problem workspace' }));
    const storyTab = workspaceTabs.getByRole('tab', { name: 'Story Mode' });
    const solutionTab = workspaceTabs.getByRole('tab', { name: 'Solution' });

    for (const workspaceTab of workspaceTabs.getAllByRole('tab')) {
      const panel = document.getElementById(workspaceTab.getAttribute('aria-controls'));
      expect(panel).not.toBeNull();
      expect(panel).toHaveAttribute('aria-labelledby', workspaceTab.id);
    }

    fireEvent.keyDown(storyTab, { key: 'End' });
    expect(solutionTab).toHaveFocus();
    expect(storyTab).toHaveAttribute('aria-selected', 'true');
    expect(solutionTab).toHaveAttribute('aria-selected', 'false');
    expect(onSolutionViewed).not.toHaveBeenCalled();
    expect(screen.queryByText('Key Insight')).not.toBeInTheDocument();

    fireEvent.keyDown(solutionTab, { key: 'Enter' });
    expect(solutionTab).toHaveAttribute('aria-selected', 'true');
    expect(onSolutionViewed).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Key Insight')).toBeInTheDocument();
  });

  test('test-console tabs have controlled panels and manual keyboard activation', async () => {
    renderProblem();
    userEvent.click(screen.getByRole('tab', { name: 'Editor' }));
    await screen.findByLabelText(/javascript code editor/i);

    const consoleTabs = within(screen.getByRole('tablist', { name: 'Test console' }));
    const testcaseTab = consoleTabs.getByRole('tab', { name: /Testcases 3/i });
    const customTab = consoleTabs.getByRole('tab', { name: 'Custom case' });

    for (const consoleTab of consoleTabs.getAllByRole('tab')) {
      const panel = document.getElementById(consoleTab.getAttribute('aria-controls'));
      expect(panel).not.toBeNull();
      expect(panel).toHaveAttribute('aria-labelledby', consoleTab.id);
    }

    fireEvent.keyDown(testcaseTab, { key: 'ArrowRight' });
    expect(customTab).toHaveFocus();
    expect(testcaseTab).toHaveAttribute('aria-selected', 'true');
    expect(customTab).toHaveAttribute('aria-selected', 'false');

    fireEvent.keyDown(customTab, { key: ' ' });
    expect(customTab).toHaveAttribute('aria-selected', 'true');
    const activePanel = screen.getByRole('tabpanel', { name: 'Custom case' });
    expect(activePanel.id).toBe(customTab.getAttribute('aria-controls'));
  });

  test('story and visual controls expose current, progress, and live state', async () => {
    renderProblem();

    const storyNavigation = screen.getByRole('navigation', { name: 'Story scenes' });
    const storyScenes = within(storyNavigation).getAllByRole('button');
    expect(storyScenes[0]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('progressbar', { name: 'Story progress' })).toHaveAttribute('aria-valuetext', expect.stringMatching(/Scene 1 of/i));
    userEvent.click(storyScenes[1]);
    expect(storyScenes[0]).not.toHaveAttribute('aria-current');
    expect(storyScenes[1]).toHaveAttribute('aria-current', 'step');

    userEvent.click(screen.getByRole('tab', { name: 'Visual' }));
    const visualNavigation = screen.getByRole('navigation', { name: 'Visualization steps' });
    const visualSteps = within(visualNavigation).getAllByRole('button');
    expect(visualSteps[0]).toHaveAttribute('aria-current', 'step');
    userEvent.click(visualSteps[1]);
    expect(visualSteps[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('status', { name: 'Current algorithm state' })).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: 'I Can Explain This' });
    expect(confirmButton).toHaveAttribute('aria-pressed', 'false');
    userEvent.click(confirmButton);
    expect(screen.getByRole('button', { name: 'Explained' })).toHaveAttribute('aria-pressed', 'true');
  });
});
