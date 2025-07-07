import { Search } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function HelpPage() {
  return (
    <div className="w-full  px-4 py-8 md:px-6 lg:py-12">
      <div className="mb-8 flex items-center justify-between flex-wrap space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Get Help</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help..."
            className="w-full rounded-md bg-background pl-9 pr-4 shadow-sm"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
            <AccordionContent>
              To reset your password, navigate to the login page and click on the "Forgot Password" link. Follow the
              instructions sent to your registered email address.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>How can I subscribe to premium content?</AccordionTrigger>
            <AccordionContent>
              You can subscribe to premium content by visiting the "Subscription" section in your account settings.
              Choose your desired plan and complete the payment process.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>Where can I find breaking news?</AccordionTrigger>
            <AccordionContent>
              Breaking news is prominently displayed on the homepage and in the dedicated "Breaking News" category. You
              can also enable push notifications for instant alerts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>Can I customize my news feed?</AccordionTrigger>
            <AccordionContent>
              Yes, you can customize your news feed by selecting your preferred topics and sources in the
              "Personalization" settings within your profile.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* User Guide Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">User Guide</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Navigating the Portal</CardTitle>
              <CardDescription>Learn how to find your way around the news portal.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Use the top navigation bar to access main sections.</li>
                <li>Explore categories from the sidebar menu.</li>
                <li>Utilize the search bar for specific articles.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Account</CardTitle>
              <CardDescription>Tips for updating your profile and settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Update your personal information in "Profile Settings".</li>
                <li>Manage your subscriptions under "Billing & Plans".</li>
                <li>Change notification preferences in "Notification Settings".</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reading Articles Offline</CardTitle>
              <CardDescription>How to save articles for later reading without internet.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Click the "Save" icon on any article page.</li>
                <li>Access saved articles from the "My Library" section.</li>
                <li>Ensure you have enough storage space on your device.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Troubleshooting</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="trouble-1">
            <AccordionTrigger>Why is the page not loading?</AccordionTrigger>
            <AccordionContent>
              Check your internet connection. If it's stable, try clearing your browser's cache and cookies, or try
              accessing the page from a different browser.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="trouble-2">
            <AccordionTrigger>I can't log in to my account.</AccordionTrigger>
            <AccordionContent>
              Ensure you are using the correct email and password. If you've forgotten your password, use the "Forgot
              Password" link. Account lockout might occur after multiple failed attempts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="trouble-3">
            <AccordionTrigger>Images are not displaying correctly.</AccordionTrigger>
            <AccordionContent>
              This could be due to a slow internet connection or browser settings. Try refreshing the page, or check if
              your browser has image loading disabled.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Contact Support Section */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold md:text-3xl">Contact Support</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Describe your issue or feedback..." className="min-h-[120px]" />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit Message
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Contact</CardTitle>
              <CardDescription>Reach out to us through other channels.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-muted-foreground">
              <div>
                <h3 className="font-medium text-foreground">Email Support</h3>
                <p>support@newsportal.com</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Phone Support</h3>
                <p>+1 (555) 123-4567</p>
                <p className="text-sm">Available Monday - Friday, 9 AM - 5 PM EST</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Address</h3>
                <p>123 News Street, Suite 400</p>
                <p>Metropolis, NY 10001</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
