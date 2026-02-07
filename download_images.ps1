$saveDir = "gallery_images"

# Ensure the directory exists
if (-not (Test-Path -Path $saveDir)) {
    New-Item -ItemType Directory -Path $saveDir | Out-Null
}

Write-Host "Starting download of 25 dummy images..."

for ($i = 1; $i -le 25; $i++) {
    $url = "https://picsum.photos/400/400?random=$((Get-Random))"
    $filename = "img$i.jpg"
    $filepath = Join-Path -Path $saveDir -ChildPath $filename
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath
        Write-Host "Downloaded: $filename"
    }
    catch {
        Write-Host "Failed to download image $i : $_"
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "Download complete!"
