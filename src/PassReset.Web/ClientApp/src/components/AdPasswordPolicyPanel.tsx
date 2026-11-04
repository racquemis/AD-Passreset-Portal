import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import type { PasswordPolicyText, PolicyResponse } from '../types/settings';

interface Props {
  policy: PolicyResponse | null;
  loading: boolean;
  text?: PasswordPolicyText;
}

const fill = (template: string, value: number) => template.replace(/\{0\}/g, String(value));

export default function AdPasswordPolicyPanel({ policy, loading, text = {} }: Props) {
  if (loading) {
    return <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />;
  }

  // Fail closed — render nothing when the policy is unavailable or the feature is off.
  if (!policy) return null;

  const rules: string[] = [
    fill(text.minLength || 'Minimum {0} characters', policy.minLength),
  ];
  if (policy.requiresComplexity) {
    rules.push(text.complexity || 'Must include uppercase, lowercase, number, and symbol');
  }
  if (policy.historyLength > 0) {
    rules.push(fill(text.history || 'Cannot reuse last {0} passwords', policy.historyLength));
  }
  if (policy.minAgeDays > 0) {
    rules.push(fill(text.minAge || 'Minimum age: {0} day(s) before it can be changed again', policy.minAgeDays));
  }
  if (policy.maxAgeDays > 0) {
    rules.push(fill(text.maxAge || 'Password expires after {0} days', policy.maxAgeDays));
  }

  return (
    <Paper
      variant="outlined"
      role="region"
      aria-label={text.panelTitle || 'Password requirements'}
      sx={{ p: 1.5, mb: 2 }}
    >
      <List dense disablePadding>
        {rules.map((rule) => (
          <ListItem key={rule} disableGutters sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText
              primary={rule}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
