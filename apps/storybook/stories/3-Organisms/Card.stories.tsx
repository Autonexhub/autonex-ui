import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@autonexhub/react';
import { Button } from '@autonexhub/react';
import { Badge } from '@autonexhub/react';

const meta: Meta<typeof Card> = {
  title: '3-Organisms/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes (width, padding)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Card container. Compose with CardHeader, CardTitle, CardDescription, CardContent, CardFooter.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the card content area.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardHeader className="pb-2">
        <CardDescription>Total Conversations</CardDescription>
        <CardTitle className="text-3xl">1,234</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          <span className="text-success">+12%</span> from last month
        </p>
      </CardContent>
    </Card>
  ),
};

export const FeatureCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Voice Agent</CardTitle>
        <CardDescription>Handle incoming calls automatically</CardDescription>
        <CardAction>
          <Badge variant="success">Active</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Calls today</span>
            <span className="font-medium">47</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg duration</span>
            <span className="font-medium">3:24</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
};
