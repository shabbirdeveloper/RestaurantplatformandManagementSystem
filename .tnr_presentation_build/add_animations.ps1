param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Output,
  [Parameter(Mandatory = $true)][string]$AuditPath
)

$ErrorActionPreference = "Stop"

# Native PowerPoint/Office constants.
$msoFalse = 0
$msoTrue = -1
$msoAnimateLevelNone = 0
$triggerOnClick = 1
$triggerWithPrevious = 2
$triggerAfterPrevious = 3
$effectFade = 10
$effectWipe = 22
$effectZoom = 23
$directionRight = 2
$directionIn = 19
$ppEffectFadeSmoothly = 3849
$ppSaveAsOpenXMLPresentation = 24

$audit = [System.Collections.Generic.List[string]]::new()
$app = $null
$presentation = $null

function Add-NamedEffect {
  param(
    [object]$Slide,
    [object]$Sequence,
    [string]$ShapeName,
    [int]$EffectId,
    [int]$Trigger,
    [double]$Duration = 0.35,
    [double]$Delay = 0.04,
    [Nullable[int]]$Direction = $null
  )

  try {
    $shape = $Slide.Shapes.Item($ShapeName)
  } catch {
    $script:audit.Add("WARN slide $($Slide.SlideIndex): missing shape '$ShapeName'")
    return $null
  }

  $effect = $Sequence.AddEffect($shape, $EffectId, $msoAnimateLevelNone, $Trigger)
  $effect.Timing.Duration = $Duration
  $effect.Timing.TriggerDelayTime = $Delay
  if ($null -ne $Direction) {
    try { $effect.EffectParameters.Direction = $Direction.Value } catch { }
  }
  $script:audit.Add("slide $($Slide.SlideIndex): $ShapeName effect=$EffectId trigger=$Trigger duration=$Duration")
  return $effect
}

function Add-LargePictureEffect {
  param(
    [object]$Slide,
    [object]$Sequence,
    [int]$Trigger,
    [double]$Duration = 0.60
  )

  for ($i = 1; $i -le $Slide.Shapes.Count; $i += 1) {
    $shape = $Slide.Shapes.Item($i)
    if (($shape.Type -eq 13 -or $shape.Type -eq 11) -and $shape.Width -ge 200 -and $shape.Height -ge 200) {
      $effect = $Sequence.AddEffect($shape, $effectZoom, $msoAnimateLevelNone, $Trigger)
      $effect.Timing.Duration = $Duration
      $effect.Timing.TriggerDelayTime = 0.02
      try { $effect.EffectParameters.Direction = $directionIn } catch { }
      $script:audit.Add("slide $($Slide.SlideIndex): official logo picture effect=$effectZoom trigger=$Trigger duration=$Duration")
      return $effect
    }
  }
  $script:audit.Add("WARN slide $($Slide.SlideIndex): large logo picture not found")
  return $null
}

function Clear-MainSequence {
  param([object]$Sequence)
  while ($Sequence.Count -gt 0) {
    $Sequence.Item(1).Delete()
  }
}

try {
  if (-not (Test-Path -LiteralPath $Source)) {
    throw "Source presentation not found: $Source"
  }
  if (Test-Path -LiteralPath $Output) {
    Remove-Item -LiteralPath $Output -Force
  }

  $app = New-Object -ComObject PowerPoint.Application
  $presentation = $app.Presentations.Open($Source, $msoFalse, $msoFalse, $msoFalse)

  foreach ($slide in $presentation.Slides) {
    $transition = $slide.SlideShowTransition
    $transition.EntryEffect = $ppEffectFadeSmoothly
    $transition.AdvanceOnClick = $msoTrue
    $transition.AdvanceOnTime = $msoFalse
    try { $transition.Duration = 0.55 } catch { }

    $sequence = $slide.TimeLine.MainSequence
    Clear-MainSequence -Sequence $sequence

    switch ($slide.SlideIndex) {
      1 {
        Add-NamedEffect $slide $sequence "cover-title" $effectFade $triggerWithPrevious 0.55 0.00 | Out-Null
        Add-LargePictureEffect $slide $sequence $triggerWithPrevious 0.60 | Out-Null
        Add-NamedEffect $slide $sequence "cover-subtitle" $effectFade $triggerAfterPrevious 0.45 0.10 | Out-Null
        Add-NamedEffect $slide $sequence "cover-presenter" $effectFade $triggerAfterPrevious 0.35 0.12 | Out-Null
        Add-NamedEffect $slide $sequence "cover-role" $effectFade $triggerWithPrevious 0.35 0.00 | Out-Null
      }
      2 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "why-statement" $effectFade $triggerOnClick 0.40 0.00 | Out-Null
        foreach ($i in 0..4) {
          Add-NamedEffect $slide $sequence "why-label-$i" $effectFade $triggerAfterPrevious 0.28 0.04 | Out-Null
          Add-NamedEffect $slide $sequence "why-desc-$i" $effectFade $triggerWithPrevious 0.28 0.00 | Out-Null
        }
        Add-NamedEffect $slide $sequence "why-core-title" $effectZoom $triggerAfterPrevious 0.42 0.08 $directionIn | Out-Null
        Add-NamedEffect $slide $sequence "why-core-caption" $effectFade $triggerAfterPrevious 0.28 0.04 | Out-Null
      }
      3 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "vision-one" $effectZoom $triggerOnClick 0.48 0.00 $directionIn | Out-Null
        foreach ($i in 0..4) {
          Add-NamedEffect $slide $sequence "vision-label-$i" $effectFade $triggerAfterPrevious 0.30 0.05 | Out-Null
          Add-NamedEffect $slide $sequence "vision-desc-$i" $effectFade $triggerWithPrevious 0.28 0.00 | Out-Null
        }
      }
      4 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "modules-big-number" $effectZoom $triggerOnClick 0.42 0.00 $directionIn | Out-Null
        Add-NamedEffect $slide $sequence "modules-stat-title" $effectFade $triggerAfterPrevious 0.28 0.04 | Out-Null
        foreach ($i in 0..4) {
          Add-NamedEffect $slide $sequence "module-left-$i-label" $effectFade $triggerAfterPrevious 0.25 0.03 | Out-Null
        }
        foreach ($i in 0..4) {
          Add-NamedEffect $slide $sequence "module-right-$i-label" $effectFade $triggerAfterPrevious 0.25 0.03 | Out-Null
        }
      }
      5 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        foreach ($i in 0..5) {
          $trigger = if ($i -eq 0) { $triggerOnClick } else { $triggerAfterPrevious }
          Add-NamedEffect $slide $sequence "journey-label-$i" $effectWipe $trigger 0.32 0.04 $directionRight | Out-Null
          Add-NamedEffect $slide $sequence "journey-desc-$i" $effectFade $triggerWithPrevious 0.28 0.00 | Out-Null
        }
        Add-NamedEffect $slide $sequence "journey-outcome-text" $effectFade $triggerAfterPrevious 0.38 0.08 | Out-Null
      }
      6 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "identity-card-tnr" $effectFade $triggerOnClick 0.34 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "identity-member-name" $effectFade $triggerAfterPrevious 0.28 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "identity-member-id" $effectFade $triggerAfterPrevious 0.28 0.03 | Out-Null
        Add-NamedEffect $slide $sequence "identity-verified" $effectZoom $triggerAfterPrevious 0.34 0.05 $directionIn | Out-Null
        foreach ($i in 0..4) {
          Add-NamedEffect $slide $sequence "identity-item-label-$i" $effectFade $triggerAfterPrevious 0.26 0.03 | Out-Null
        }
        Add-NamedEffect $slide $sequence "identity-trust" $effectFade $triggerAfterPrevious 0.30 0.05 | Out-Null
      }
      7 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "ai-left-label" $effectFade $triggerOnClick 0.30 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "ai-bubble-1-text" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "ai-bubble-2-text" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        foreach ($i in 1..3) {
          Add-NamedEffect $slide $sequence "ai-check-$i-text" $effectFade $triggerAfterPrevious 0.25 0.03 | Out-Null
        }
        Add-NamedEffect $slide $sequence "cv-right-label" $effectFade $triggerAfterPrevious 0.30 0.06 | Out-Null
        Add-NamedEffect $slide $sequence "cv-output-copy" $effectZoom $triggerAfterPrevious 0.34 0.04 $directionIn | Out-Null
        foreach ($i in 1..2) {
          Add-NamedEffect $slide $sequence "cv-check-$i-text" $effectFade $triggerAfterPrevious 0.25 0.03 | Out-Null
        }
      }
      8 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "election-left-big" $effectFade $triggerOnClick 0.38 0.00 | Out-Null
        foreach ($i in 0..3) {
          Add-NamedEffect $slide $sequence "vote-label-$i" $effectFade $triggerAfterPrevious 0.27 0.03 | Out-Null
        }
        Add-NamedEffect $slide $sequence "org-right-big" $effectFade $triggerAfterPrevious 0.38 0.07 | Out-Null
        foreach ($i in 0..2) {
          Add-NamedEffect $slide $sequence "org-label-$i" $effectFade $triggerAfterPrevious 0.27 0.03 | Out-Null
          Add-NamedEffect $slide $sequence "org-desc-$i" $effectFade $triggerWithPrevious 0.27 0.00 | Out-Null
        }
      }
      9 {
        Add-NamedEffect $slide $sequence "slide-title" $effectFade $triggerWithPrevious 0.45 0.00 | Out-Null
        Add-NamedEffect $slide $sequence "slide-subtitle" $effectFade $triggerAfterPrevious 0.30 0.04 | Out-Null
        Add-NamedEffect $slide $sequence "benefit-core-label" $effectZoom $triggerOnClick 0.42 0.00 $directionIn | Out-Null
        foreach ($i in 0..3) {
          Add-NamedEffect $slide $sequence "benefit-left-label-$i" $effectFade $triggerAfterPrevious 0.26 0.03 | Out-Null
          Add-NamedEffect $slide $sequence "benefit-right-label-$i" $effectFade $triggerAfterPrevious 0.26 0.03 | Out-Null
        }
      }
      10 {
        Add-NamedEffect $slide $sequence "closing-main" $effectFade $triggerWithPrevious 0.55 0.00 | Out-Null
        Add-LargePictureEffect $slide $sequence $triggerWithPrevious 0.60 | Out-Null
        Add-NamedEffect $slide $sequence "closing-quote" $effectFade $triggerAfterPrevious 0.45 0.12 | Out-Null
        Add-NamedEffect $slide $sequence "closing-presenter" $effectFade $triggerAfterPrevious 0.32 0.10 | Out-Null
        Add-NamedEffect $slide $sequence "closing-platform" $effectFade $triggerWithPrevious 0.32 0.00 | Out-Null
      }
    }

    $audit.Add("slide $($slide.SlideIndex): transition=$ppEffectFadeSmoothly effects=$($sequence.Count)")
  }

  $presentation.SaveAs($Output, $ppSaveAsOpenXMLPresentation, $msoFalse)
  $presentation.Close()
  $presentation = $null
  $app.Quit()
  $app = $null

  $audit.Add("output=$Output")
  $audit | Set-Content -LiteralPath $AuditPath -Encoding UTF8
} finally {
  if ($null -ne $presentation) {
    try { $presentation.Close() } catch { }
  }
  if ($null -ne $app) {
    try { $app.Quit() } catch { }
  }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}
