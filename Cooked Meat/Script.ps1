# Read the content from file
$content = Get-Content -Path ".\subtitle.txt"

# Create a new PowerPoint application and open a new presentation
$powerpoint = New-Object -ComObject PowerPoint.Application
$presentation = $powerpoint.Presentations.Add()

# Loop through each line of the content and add a slide for each title and subtitle
for ($i = 0; $i -lt $content.Count; $i += 1) {
    $slide = $presentation.Slides.Add($i+1, 1)
    $title = $slide.Shapes[1]
    $subtitle = $slide.Shapes[2]
    
    $title.TextFrame.TextRange.Text = ""
    $subtitle.TextFrame.TextRange.Text = $content[$i]
}

#Generated by ChatGPT